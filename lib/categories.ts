import fs from "fs";
import path from "path";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

const categoriesPath = path.join(
  process.cwd(),
  "content",
  "categories.json"
);

export function getCategories(): Category[] {
  const fileContents = fs.readFileSync(categoriesPath, "utf8");

  return JSON.parse(fileContents) as Category[];
}