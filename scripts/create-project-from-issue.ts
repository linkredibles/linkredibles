type Issue = {
    number: number;
    title: string;
    body: string | null;
    html_url: string;
  };

  type Repository = {
    full_name: string;
    default_branch: string;
  };

  type GitRef = {
    object: {
      sha: string;
    };
  };

  type GitBlob = {
    sha: string;
  };

  type PullRequest = {
    html_url: string;
  };

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is required.");
  }

  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    throw new Error("GITHUB_REPOSITORY is required.");
  }

  const issueNumber = Number(process.env.ISSUE_NUMBER);

  if (!issueNumber) {
    throw new Error("ISSUE_NUMBER is required.");
  }

  const apiBase = "https://api.github.com";

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  async function github<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${apiBase}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}\n${body}`
      );
    }

    return response.json() as Promise<T>;
  }

  function getField(body: string, label: string) {
    const lines = body.replace(/\r\n/g, "\n").split("\n");

    const heading = `### ${label}`.trim();

    const headingIndex = lines.findIndex(
      (line) => line.trim() === heading
    );

    if (headingIndex === -1) {
      throw new Error(`Missing required field: ${label}`);
    }

    const valueLines: string[] = [];

    for (
      let index = headingIndex + 1;
      index < lines.length;
      index++
    ) {
      const line = lines[index];

      if (line.trim().startsWith("### ")) {
        break;
      }

      valueLines.push(line);
    }

    const value = valueLines.join("\n").trim();

    if (!value || value === "_No response_") {
      throw new Error(`Empty required field: ${label}`);
    }

    return value;
  }

  function getOptionalField(body: string, label: string) {
    const lines = body.replace(/\r\n/g, "\n").split("\n");

    const heading = `### ${label}`.trim();

    const headingIndex = lines.findIndex(
      (line) => line.trim() === heading
    );

    if (headingIndex === -1) {
      return undefined;
    }

    const valueLines: string[] = [];

    for (
      let index = headingIndex + 1;
      index < lines.length;
      index++
    ) {
      const line = lines[index];

      if (line.trim().startsWith("### ")) {
        break;
      }

      valueLines.push(line);
    }

    const value = valueLines.join("\n").trim();

    if (!value || value === "_No response_") {
      return undefined;
    }

    return value;
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function parseTags(value: string) {
    return value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);
  }

  function normalizeCategory(value: string) {
    const categories: Record<string, string> = {
      ai: "ai",
      "developer tools": "developer-tools",
      web: "web",
      "self-hosted": "self-hosted",
      design: "design",
      productivity: "productivity",
    };

    const category = categories[value.trim().toLowerCase()];

    if (!category) {
      throw new Error(`Unknown category: ${value}`);
    }

    return category;
  }

  function validateGitHubUrl(value: string) {
    const url = new URL(value.trim());

    if (url.protocol !== "https:") {
      throw new Error("GitHub URL must use HTTPS.");
    }

    if (url.hostname !== "github.com") {
      throw new Error("GitHub URL must point to github.com.");
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      throw new Error("GitHub URL must point to a repository.");
    }

    return `https://github.com/${parts[0]}/${parts[1]}`;
  }

  function validateWebsite(value: string | undefined) {
    if (!value) {
      return undefined;
    }

    const cleanedValue = value
      .trim()
      .replace(/^\[([^\]]+)\]\([^)]+\)$/, "$1");

    const url = new URL(cleanedValue);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Project website must use HTTP or HTTPS.");
    }

    return url.toString();
  }

  function encodeBase64(value: string) {
    return Buffer.from(value, "utf8").toString("base64");
  }

  async function main() {
    console.log(`Processing issue #${issueNumber}...`);

    const issue = await github<Issue>(
      `/repos/${repository}/issues/${issueNumber}`
    );

    if (!issue.body) {
      throw new Error("Issue has no body.");
    }

    console.log("Reading submission fields...");

    const projectName = getField(
      issue.body,
      "Project name"
    );

    const githubUrl = validateGitHubUrl(
      getField(issue.body, "GitHub repository")
    );

    const website = validateWebsite(
      getOptionalField(issue.body, "Project website")
    );

    const description = getField(
      issue.body,
      "Project description"
    );

    const why = getField(
      issue.body,
      "Why is it interesting?"
    );

    const category = normalizeCategory(
      getField(issue.body, "Category")
    );

    const tags = parseTags(
      getField(issue.body, "Tags")
    );

    const slug = slugify(projectName);

    if (!slug) {
      throw new Error(
        "Could not create a valid project slug."
      );
    }

    const project = {
      slug,
      name: projectName,
      description,
      why,
      ...(website ? { website } : {}),
      github: githubUrl,
      categories: [category],
      tags,
      featured: false,
    };

    const projectPath = `content/projects/${slug}.json`;
    const branchName = `submission/${slug}-${issueNumber}`;

    console.log(`Project slug: ${slug}`);
    console.log(`Project path: ${projectPath}`);
    console.log(`Branch: ${branchName}`);

    const repo = await github<Repository>(
      `/repos/${repository}`
    );

    const defaultBranch = repo.default_branch;

    /*
     * ------------------------------------------------------------
     * 1. Prevent duplicate projects on the default branch
     * ------------------------------------------------------------
     */

    console.log(
      `Checking whether ${projectPath} already exists on ${defaultBranch}...`
    );

    try {
      await github<GitBlob>(
        `/repos/${repository}/contents/${projectPath}?ref=${defaultBranch}`
      );

      throw new Error(
        `Project "${slug}" already exists at ${projectPath} on ${defaultBranch}. ` +
        `This submission will not overwrite an existing project.`
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(
          `Project "${slug}" already exists`
        )
      ) {
        throw error;
      }

      /*
       * A 404 means the project does not exist on the default
       * branch, which is what we want.
       */
      console.log(
        `No existing project found at ${projectPath}. Continuing...`
      );
    }

    /*
     * ------------------------------------------------------------
     * 2. Check whether the submission branch already exists
     * ------------------------------------------------------------
     */

    const branchRef = await github<GitRef>(
      `/repos/${repository}/git/ref/heads/${defaultBranch}`
    );

    let branchExists = false;

    try {
      await github<GitRef>(
        `/repos/${repository}/git/ref/heads/${branchName}`
      );

      branchExists = true;

      console.log(
        `Branch ${branchName} already exists. Reusing it.`
      );
    } catch {
      branchExists = false;
    }

    /*
     * Create the branch only when it does not already exist.
     */

    if (!branchExists) {
      console.log(
        `Creating branch from ${defaultBranch}...`
      );

      await github(
        `/repos/${repository}/git/refs`,
        {
          method: "POST",
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: branchRef.object.sha,
          }),
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * 3. Create or update the project JSON file
     * ------------------------------------------------------------
     */

    const fileContent =
      `${JSON.stringify(project, null, 2)}\n`;

    let existingFile: GitBlob | null = null;

    try {
      existingFile = await github<GitBlob>(
        `/repos/${repository}/contents/${projectPath}?ref=${branchName}`
      );
    } catch {
      existingFile = null;
    }

    console.log(
      `${existingFile ? "Updating" : "Creating"} ${projectPath}...`
    );

    await github(
      `/repos/${repository}/contents/${projectPath}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message: existingFile
            ? `Update ${projectName}`
            : `Add ${projectName}`,
          content: encodeBase64(fileContent),
          branch: branchName,
          ...(existingFile
            ? { sha: existingFile.sha }
            : {}),
        }),
      }
    );

    /*
     * ------------------------------------------------------------
     * 4. Check whether an open PR already exists
     * ------------------------------------------------------------
     */

    console.log(
      "Checking for an existing pull request..."
    );

    const owner = repository.split("/")[0];

    const existingPullRequests =
      await github<PullRequest[]>(
        `/repos/${repository}/pulls?state=open&head=${encodeURIComponent(
          `${owner}:${branchName}`
        )}&base=${encodeURIComponent(defaultBranch)}`
      );

    if (existingPullRequests.length > 0) {
      console.log(
        `Pull request already exists: ${existingPullRequests[0].html_url}`
      );

      return;
    }

    /*
     * ------------------------------------------------------------
     * 5. Create the pull request
     * ------------------------------------------------------------
     */

    console.log("Creating pull request...");

    const pullRequest = await github<PullRequest>(
      `/repos/${repository}/pulls`,
      {
        method: "POST",
        body: JSON.stringify({
          title: `Add ${projectName}`,
          head: branchName,
          base: defaultBranch,
          body: [
            "## Project submission",
            "",
            `This PR was generated from #${issueNumber}.`,
            "",
            `**Project:** ${projectName}`,
            "",
            `**Repository:** ${githubUrl}`,
            "",
            `**Category:** ${category}`,
            "",
            "Please review the generated project entry before merging.",
            "",
            `Original submission: ${issue.html_url}`,
          ].join("\n"),
        }),
      }
    );

    console.log(
      `Created PR: ${pullRequest.html_url}`
    );
  }

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
