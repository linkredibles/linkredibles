import Link from "next/link";

import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="flex items-center justify-between">
          <div />

          <Link
            href="/#discover"
            className="text-sm text-zinc-600 transition hover:text-zinc-950"
          >
            ← Back to discover
          </Link>
        </div>

        <div className="mt-16 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Open-source library
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Discover projects
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-600">
            Explore the growing collection of open-source projects curated
            by Linkredibles.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              All projects
            </h2>

            <span className="text-sm text-zinc-500">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
              <p className="text-sm text-zinc-500">
                No projects have been added yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.slug}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-200 p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
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

                  <h3 className="mt-6 text-xl font-semibold tracking-tight">
                    <Link
                      href={`/project/${project.slug}`}
                      className="transition hover:text-zinc-600"
                    >
                      {project.name}
                    </Link>
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 border-t border-zinc-100 pt-5">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
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

                      {project.githubData?.license && (
                        <span>{project.githubData.license}</span>
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
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500">
          © 2026 Linkredibles
        </div>
      </footer>
    </main>
  );
}