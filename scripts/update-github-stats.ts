import fs from "fs";
import path from "path";

type Project = {
  slug: string;
  github: string;
};

type GitHubRepository = {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  license: {
    spdx_id: string | null;
    name: string | null;
  } | null;
};

type GitHubStats = {
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  license: string | null;
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");
const outputPath = path.join(process.cwd(), "content", "github-stats.json");

const token = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

function getRepositoryPath(githubUrl: string): string {
  let url: URL;

  try {
    url = new URL(githubUrl);
  } catch {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  if (url.hostname !== "github.com") {
    throw new Error(`Invalid GitHub hostname: ${githubUrl}`);
  }

  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error(`Invalid GitHub repository URL: ${githubUrl}`);
  }

  return `${parts[0]}/${parts[1]}`;
}

async function getRepository(repository: string): Promise<GitHubRepository> {
  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers,
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `GitHub API request failed for ${repository}: ${response.status} ${body}`
    );
  }

  return response.json() as Promise<GitHubRepository>;
}

function readProjects(): Project[] {
  const files = fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const filePath = path.join(projectsDirectory, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as Project;
  });
}

function readExistingStats(): Record<string, GitHubStats> {
  if (!fs.existsSync(outputPath)) {
    return {};
  }

  try {
    return JSON.parse(
      fs.readFileSync(outputPath, "utf8")
    ) as Record<string, GitHubStats>;
  } catch {
    console.warn("Could not read existing GitHub stats. Starting fresh.");
    return {};
  }
}

async function main() {
  const projects = readProjects();
  const existingStats = readExistingStats();

  const stats: Record<string, GitHubStats> = {
    ...existingStats,
  };

  let successful = 0;
  let failed = 0;

  const failures: Array<{
    slug: string;
    github: string;
    error: string;
  }> = [];

  for (const project of projects) {
    console.log(`Fetching ${project.slug} (${project.github})...`);

    try {
      const repository = getRepositoryPath(project.github);
      const data = await getRepository(repository);

      stats[project.slug] = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        updatedAt: data.updated_at,
        license: data.license?.name ?? data.license?.spdx_id ?? null,
      };

      successful++;
    } catch (error) {
      failed++;

      const message =
        error instanceof Error ? error.message : String(error);

      console.warn(`⚠ Failed: ${project.slug}`);
      console.warn(`  GitHub: ${project.github}`);
      console.warn(`  Error: ${message}`);

      failures.push({
        slug: project.slug,
        github: project.github,
        error: message,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(stats, null, 2)}\n`,
    "utf8"
  );

  console.log("");
  console.log("GitHub stats update complete.");
  console.log(`Projects processed: ${projects.length}`);
  console.log(`Successfully updated: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Stats available: ${Object.keys(stats).length}`);
  console.log(`Wrote ${outputPath}`);

  if (failures.length > 0) {
    console.log("");
    console.log("Failed projects:");

    for (const failure of failures) {
      console.log(`- ${failure.slug}: ${failure.error}`);
    }

    console.log("");
    console.log(
      `${failures.length} project(s) could not be updated. Existing stats were preserved where available.`
    );
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});