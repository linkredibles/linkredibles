import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";

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

function readProjects(): Project[] {
  const files = fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const filePath = path.join(projectsDirectory, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    return JSON.parse(fileContents) as Project;
  });
}

const getCachedProjects = unstable_cache(
  async () => {
    return readProjects();
  },
  ["linkredibles-projects"],
  {
    revalidate: 3600,
  }
);

export async function getProjects(): Promise<Project[]> {
  return getCachedProjects();
}

export function getProjectSlugs(): string[] {
  return readProjects().map((project) => project.slug);
}