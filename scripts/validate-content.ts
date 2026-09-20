import fs from "fs";
import path from "path";

type Project = {
  slug?: unknown;
  name?: unknown;
  description?: unknown;
  why?: unknown;
  website?: unknown;
  github?: unknown;
  categories?: unknown;
  tags?: unknown;
  featured?: unknown;
};

const rootDirectory = process.cwd();
const projectsDirectory = path.join(
  rootDirectory,
  "content",
  "projects"
);

const categoriesPath = path.join(
  rootDirectory,
  "content",
  "categories.json"
);

let hasErrors = false;

function error(message: string) {
  console.error(`✖ ${message}`);
  hasErrors = true;
}

function success(message: string) {
  console.log(`✔ ${message}`);
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidGitHubUrl(value: unknown): value is string {
  if (!isValidUrl(value)) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.hostname === "github.com" &&
      url.pathname.split("/").filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" && item.trim().length > 0
    )
  );
}

console.log("Validating Linkredibles content...\n");

// --------------------------------------------------
// Categories
// --------------------------------------------------

if (!fs.existsSync(categoriesPath)) {
  error("content/categories.json does not exist.");
  process.exit(1);
}

let categories: Array<{
  slug?: unknown;
  name?: unknown;
  description?: unknown;
}>;

try {
  const contents = fs.readFileSync(categoriesPath, "utf8");
  categories = JSON.parse(contents);
} catch {
  error("content/categories.json contains invalid JSON.");
  process.exit(1);
}

const categorySlugs = new Set<string>();

for (const category of categories) {
  if (!isNonEmptyString(category.slug)) {
    error("A category is missing a valid slug.");
    continue;
  }

  if (!isNonEmptyString(category.name)) {
    error(`Category "${category.slug}" is missing a valid name.`);
  }

  if (!isNonEmptyString(category.description)) {
    error(
      `Category "${category.slug}" is missing a valid description.`
    );
  }

  if (categorySlugs.has(category.slug)) {
    error(`Duplicate category slug: "${category.slug}".`);
  }

  categorySlugs.add(category.slug);
}

success(`${categories.length} categories checked.`);

// --------------------------------------------------
// Projects
// --------------------------------------------------

if (!fs.existsSync(projectsDirectory)) {
  error("content/projects directory does not exist.");
  process.exit(1);
}

const projectFiles = fs
  .readdirSync(projectsDirectory)
  .filter((file) => file.endsWith(".json"));

const projectSlugs = new Set<string>();
const githubUrls = new Set<string>();

for (const file of projectFiles) {
  const filePath = path.join(projectsDirectory, file);

  let project: Project;

  try {
    const contents = fs.readFileSync(filePath, "utf8");
    project = JSON.parse(contents) as Project;
  } catch {
    error(`${file}: invalid JSON.`);
    continue;
  }

  const label = `${file}`;

  // Required strings
  if (!isNonEmptyString(project.slug)) {
    error(`${label}: "slug" must be a non-empty string.`);
  }

  if (!isNonEmptyString(project.name)) {
    error(`${label}: "name" must be a non-empty string.`);
  }

  if (!isNonEmptyString(project.description)) {
    error(`${label}: "description" must be a non-empty string.`);
  }

  if (!isNonEmptyString(project.github)) {
    error(`${label}: "github" must be a non-empty string.`);
  }

  // Optional strings
  if (
    project.why !== undefined &&
    !isNonEmptyString(project.why)
  ) {
    error(`${label}: "why" must be a non-empty string when provided.`);
  }

  if (
    project.website !== undefined &&
    !isValidUrl(project.website)
  ) {
    error(`${label}: "website" must be a valid HTTP/HTTPS URL.`);
  }

  // GitHub URL
  if (!isValidGitHubUrl(project.github)) {
    error(
      `${label}: "github" must be a valid GitHub repository URL.`
    );
  }

  // Categories
  if (!isStringArray(project.categories)) {
    error(`${label}: "categories" must be an array of strings.`);
  } else {
    for (const category of project.categories) {
      if (!categorySlugs.has(category)) {
        error(
          `${label}: unknown category "${category}".`
        );
      }
    }
  }

  // Tags
  if (!isStringArray(project.tags)) {
    error(`${label}: "tags" must be an array of strings.`);
  }

  // Featured
  if (typeof project.featured !== "boolean") {
    error(`${label}: "featured" must be true or false.`);
  }

  // Duplicate slug
  if (isNonEmptyString(project.slug)) {
    if (projectSlugs.has(project.slug)) {
      error(`Duplicate project slug: "${project.slug}".`);
    }

    projectSlugs.add(project.slug);
  }

  // Duplicate GitHub repository
  if (isValidGitHubUrl(project.github)) {
    const normalizedGithub = project.github
      .replace(/\/+$/, "")
      .toLowerCase();

    if (githubUrls.has(normalizedGithub)) {
      error(
        `Duplicate GitHub repository: "${project.github}".`
      );
    }

    githubUrls.add(normalizedGithub);
  }
}

success(`${projectFiles.length} projects checked.`);

// --------------------------------------------------
// Result
// --------------------------------------------------

console.log("");

if (hasErrors) {
  console.error("Content validation failed.");
  process.exit(1);
}

console.log("Content validation passed.");

