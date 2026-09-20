"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project } from "@/lib/projects";
import type { Category } from "@/lib/categories";

type ProjectBrowserProps = {
  projects: Project[];
  categories: Category[];
};

const PROJECTS_PER_LOAD = 20;

export default function ProjectBrowser({
  projects,
  categories,
}: ProjectBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" ||
        project.categories.includes(selectedCategory);

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        project.name,
        project.description,
        project.tags.join(" "),
        project.categories.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [projects, query, selectedCategory]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const hasMoreProjects = visibleCount < filteredProjects.length;

  function handleSearch(value: string) {
    setQuery(value);
    setVisibleCount(PROJECTS_PER_LOAD);
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setVisibleCount(PROJECTS_PER_LOAD);
  }

  function handleLoadMore() {
    setIsLoading(true);

    window.setTimeout(() => {
      setVisibleCount((current) => current + PROJECTS_PER_LOAD);
      setIsLoading(false);
    }, 350);
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategory("all");
    setVisibleCount(PROJECTS_PER_LOAD);
  }

  return (
    <>
      {/* Search */}
      <div className="mt-8 max-w-2xl">
        <label htmlFor="project-search" className="sr-only">
          Search projects
        </label>

        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search projects, tools, topics..."
          className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
        />
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategory === "all"
              ? "bg-zinc-950 text-white"
              : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-950"
          }`}
        >
          All
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => handleCategoryChange(category.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-950"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Results heading */}
      <div className="mt-12 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Discover more
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Explore the collection.
          </h3>
        </div>

        <span className="shrink-0 text-sm text-zinc-500">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* Results */}
      {visibleProjects.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProjects.map((project) => (
              <article
                key={project.slug}
                className="group flex min-h-[340px] flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/categories/${project.categories[0]}`}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600 transition hover:bg-zinc-200"
                  >
                    {project.categories[0]?.replace("-", " ")}
                  </Link>

                  {project.featured && (
                    <span className="text-xs font-medium text-zinc-400">
                      Featured
                    </span>
                  )}
                </div>

                <h4 className="mt-6 text-lg font-semibold tracking-tight">
                  <Link
                    href={`/project/${project.slug}`}
                    className="transition hover:text-zinc-600"
                  >
                    {project.name}
                  </Link>
                </h4>

                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-5">
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-zinc-500">
                    <span>
                      ★{" "}
                      {project.githubData?.stars.toLocaleString() ?? "—"}
                    </span>

                    {project.githubData?.forks !== undefined && (
                      <span>
                        {project.githubData.forks.toLocaleString()} forks
                      </span>
                    )}

                    {project.githubData?.language && (
                      <span>{project.githubData.language}</span>
                    )}
                  </div>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-zinc-950 transition group-hover:underline"
                  >
                    View on GitHub
                    <span className="ml-2">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Load more */}
          {hasMoreProjects && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load 20 more"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-zinc-700">
            No projects found.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Try another search or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}