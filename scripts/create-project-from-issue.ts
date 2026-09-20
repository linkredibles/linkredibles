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
  
  async function github<T>(url: string, options: RequestInit = {}): Promise<T> {
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
    const pattern = new RegExp(
      `### ${label}\\s*\\n\\s*([\\s\\S]*?)(?=\\n### |$)`,
      "i"
    );
  
    const match = body.match(pattern);
  
    if (!match) {
      throw new Error(`Missing required field: ${label}`);
    }
  
    const value = match[1].trim();
  
    if (!value || value === "_No response_") {
      throw new Error(`Empty required field: ${label}`);
    }
  
    return value;
  }
  
  function getOptionalField(body: string, label: string) {
    const pattern = new RegExp(
      `### ${label}\\s*\\n\\s*([\\s\\S]*?)(?=\\n### |$)`,
      "i"
    );
  
    const match = body.match(pattern);
  
    if (!match) {
      return undefined;
    }
  
    const value = match[1].trim();
  
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
    const url = new URL(value);
  
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
  
    const url = new URL(value);
  
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Project website must use HTTP or HTTPS.");
    }
  
    return url.toString();
  }
  
  function encodeBase64(value: string) {
    return Buffer.from(value, "utf8").toString("base64");
  }
  
  async function main() {
    const issue = await github<Issue>(
      `/repos/${repository}/issues/${issueNumber}`
    );
  
    if (!issue.body) {
      throw new Error("Issue has no body.");
    }
  
    const projectName = getField(issue.body, "Project name");
    const githubUrl = validateGitHubUrl(
      getField(issue.body, "GitHub repository")
    );
    const website = validateWebsite(
      getOptionalField(issue.body, "Project website")
    );
    const description = getField(issue.body, "Project description");
    const why = getField(issue.body, "Why is it interesting?");
    const category = normalizeCategory(getField(issue.body, "Category"));
    const tags = parseTags(getField(issue.body, "Tags"));
  
    const slug = slugify(projectName);
  
    if (!slug) {
      throw new Error("Could not create a valid project slug.");
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
  
    const repo = await github<Repository>(`/repos/${repository}`);
  
    const defaultBranch = repo.default_branch;
  
    const branchRef = await github<GitRef>(
      `/repos/${repository}/git/ref/heads/${defaultBranch}`
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
  
    const fileContent = `${JSON.stringify(project, null, 2)}\n`;
  
    const file = await github<GitBlob>(
      `/repos/${repository}/contents/${projectPath}?ref=${branchName}`
    ).catch(() => null);
  
    await github(
      `/repos/${repository}/contents/${projectPath}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Add ${projectName}`,
          content: encodeBase64(fileContent),
          branch: branchName,
          ...(file ? { sha: file.sha } : {}),
        }),
      }
    );
  
    const pullRequest = await github<PullRequest>(
      `/repos/${repository}/pulls`,
      {
        method: "POST",
        body: JSON.stringify({
          title: `Add ${projectName}`,
          head: branchName,
          base: defaultBranch,
          body: [
            `## Project submission`,
            "",
            `This PR was generated from #${issueNumber}.`,
            "",
            `**Project:** ${projectName}`,
            "",
            `**Repository:** ${githubUrl}`,
            "",
            `**Category:** ${category}`,
            "",
            `Please review the generated project entry before merging.`,
            "",
            `Original submission: ${issue.html_url}`,
          ].join("\n"),
        }),
      }
    );
  
    console.log(`Created PR: ${pullRequest.html_url}`);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });