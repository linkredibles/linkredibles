import Link from "next/link";

import ProjectBrowser from "@/app/components/project-browser";
import { getCategories } from "@/lib/categories";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();
  const categories = getCategories();

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 4);

  const discoveryProjects = projects.filter(
    (project) => !project.featured
  );

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-28 md:pt-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              The interesting side of GitHub
            </p>

            <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Discover open-source projects worth knowing.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
              A curated collection of interesting open-source projects,
              developer tools, AI apps, self-hosted software, and other
              things worth exploring.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#discover"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Explore projects
              </Link>

              <Link
                href="#categories"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
              >
                Browse categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                Editor&apos;s picks
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Projects worth knowing.
              </h2>

              <p className="mt-4 text-lg leading-7 text-zinc-600">
                A small selection of open-source projects we think deserve
                your attention.
              </p>
            </div>

            <Link
              href="/projects"
              className="shrink-0 text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
            >
              View all projects →
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((project) => (
                <article
                  key={project.slug}
                  className="group relative flex min-h-[410px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-xl"
                >
                  {/* Main card link */}
                  <Link
                    href={`/project/${project.slug}`}
                    aria-label={`View ${project.name} project`}
                    className="absolute inset-0 z-0 rounded-2xl"
                  />

                  {/* Card content */}
                  <div className="relative z-10 pointer-events-none flex h-full flex-col">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      {project.categories[0] ? (
                        <span className="pointer-events-auto">
                          <Link
                            href={`/categories/${project.categories[0]}`}
                            className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium capitalize text-zinc-600 transition hover:bg-zinc-200"
                          >
                            {project.categories[0].replace("-", " ")}
                          </Link>
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                        Featured
                      </span>
                    </div>

                    {/* Project name */}
                    <h3 className="mt-9 text-2xl font-semibold tracking-tight">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <div className="mt-4 flex-1">
                      <p className="text-sm leading-7 text-zinc-600">
                        {project.description}
                      </p>

                      {project.why && (
                        <p className="mt-4 border-l-2 border-zinc-200 pl-4 text-sm leading-6 text-zinc-500">
                          {project.why}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {project.tags.length > 0 && (
                      <div className="mt-7 flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-7 border-t border-zinc-100 pt-5">
                      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-zinc-500">
                        <span>
                          ★{" "}
                          {project.githubData?.stars.toLocaleString() ?? "—"}
                        </span>

                        <span>
                          {project.githubData?.forks.toLocaleString() ?? "—"}{" "}
                          forks
                        </span>

                        {project.githubData?.language && (
                          <span>{project.githubData.language}</span>
                        )}
                      </div>

                      <span className="pointer-events-auto">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center text-sm font-medium text-zinc-950 transition hover:underline"
                        >
                          View on GitHub
                          <span className="ml-2">↗</span>
                        </a>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
              <p className="text-sm text-zinc-500">
                No featured projects have been added yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Explore */}
      <section
        id="discover"
        className="border-b border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Explore the collection
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Find something interesting.
            </h2>

            <p className="mt-4 text-lg leading-7 text-zinc-600">
              Search the collection or explore projects by category.
            </p>
          </div>

          <ProjectBrowser
            projects={discoveryProjects}
            categories={categories}
          />
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-b border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Explore by topic
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Find your corner of open source.
            </h2>

            <p className="mt-4 text-zinc-600">
              Browse curated projects across the areas you care about.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {category.name}
                  </h3>

                  <span className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950">
                    →
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-b border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              About Linkredibles
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Open source is full of interesting things.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Linkredibles exists to make discovering those things easier.
              Instead of trying to list everything on GitHub, we focus on
              projects that are genuinely interesting, useful, unusual, or
              worth knowing about.
            </p>

            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Think of it as a curated discovery layer for the open-source
              ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-zinc-950">
              Linkredibles
            </p>

            <p className="mt-1">
              Discover open-source projects worth knowing.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="#discover"
              className="transition hover:text-zinc-950"
            >
              Discover
            </Link>

            <Link
              href="#categories"
              className="transition hover:text-zinc-950"
            >
              Categories
            </Link>

            <Link
              href="#about"
              className="transition hover:text-zinc-950"
            >
              About
            </Link>

            <Link
              href="/projects"
              className="transition hover:text-zinc-950"
            >
              Projects
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}