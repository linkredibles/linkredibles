import type { MetadataRoute } from "next";

import { getCategories } from "@/lib/categories";
import { getProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://linkredibles.com";

  const categories = getCategories();
  const projects = await getProjects();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const projectPages: MetadataRoute.Sitemap = projects.map(
    (project) => ({
      url: `${baseUrl}/project/${project.slug}`,
      changeFrequency: "weekly",
      priority: project.featured ? 0.8 : 0.6,
    })
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...projectPages,
  ];
}