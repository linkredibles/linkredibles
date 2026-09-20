import fs from "fs";
import path from "path";

export type Project = {
    slug: string;
    name: string;
    description: string;
    why?: string;
    website?: string;
    github: string;
    categories: string[];
    tags: string[];
    featured: boolean;
    githubData?: {
    stars: number;
    forks: number;
    language: string | null;
    updatedAt: string;
    license: string | null;
  };
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");

type GitHubRepository = {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  license: {
    name: string;
  } | null;
};

function getGitHubRepositoryPath(githubUrl: string) {
  const url = new URL(githubUrl);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  return `${parts[0]}/${parts[1]}`;
}

async function getGitHubData(githubUrl: string) {
  const repository = getGitHubRepositoryPath(githubUrl);

  const response = await fetch(
    `https://api.github.com/repos/${repository}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    console.error(
      `GitHub API request failed for ${repository}: ${response.status}`
    );

    return undefined;
  }

  const data = (await response.json()) as GitHubRepository;

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    updatedAt: data.updated_at,
    license: data.license?.name ?? null,
  };
}

export async function getProjects(): Promise<Project[]> {
  const files = fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".json"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(projectsDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");

      const project = JSON.parse(fileContents) as Project;

      const githubData = await getGitHubData(project.github);

      return {
        ...project,
        githubData,
      };
    })
  );

  return projects;
}