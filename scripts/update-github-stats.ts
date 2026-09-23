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

if (!token) {
  throw new Error("GITHUB_TOKEN is required to update GitHub stats.");
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

function getRepositoryPath(githubUrl: string): string {
  const url = new URL(githubUrl);
  const parts = url.pathname.split("/").filter(Boolean);

  if (url.hostname !== "github.com" || parts.length < 2) {
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

async function main() {
  const projects = readProjects();
  const stats: Record<string, GitHubStats> = {};

  for (const project of projects) {
    const repository = getRepositoryPath(project.github);

    console.log(`Fetching ${project.slug} (${repository})...`);

    const data = await getRepository(repository);

    await new Promise((resolve) => setTimeout(resolve, 200));

    stats[project.slug] = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
      license: data.license?.name ?? data.license?.spdx_id ?? null,
    };
  }

  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(stats, null, 2)}\n`,
    "utf8"
  );

  console.log(`Updated ${Object.keys(stats).length} GitHub projects.`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});



