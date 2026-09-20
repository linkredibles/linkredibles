import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { getCategories } from "@/lib/categories";

export default async function Home() {
  const projects = await getProjects();
  const categories = getCategories();

  const formatUpdatedDate = (date: string) => {
    const days = Math.round(
      (new Date(date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    return new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(days, "day");
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight"
        >
          linkredibles
        </Link>

        <div className="flex items-center gap-6 text-sm text-zinc-600">
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
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            The interesting side of GitHub
          </p>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Discover open-source projects worth knowing.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">
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
              href="#about"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
            >
              About Linkredibles
            </Link>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        id="discover"
        className="border-t border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                Curated projects
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Worth exploring
              </h2>

              <p className="mt-3 max-w-xl text-zinc-600">
                Hand-picked projects from the open-source ecosystem.
              </p>
            </div>

            <Link
              href="/projects"
              className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
            >
              View all projects →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                {/* Category */}
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

                {/* Project name */}
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  <Link
                    href={`/project/${project.slug}`}
                    className="transition hover:text-zinc-600"
                  >
                    {project.name}
                  </Link>
                </h3>

                {/* Description */}
                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                  {project.description}
                </p>

                {/* Tags */}
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

                {/* GitHub metadata */}
                <div className="mt-7 border-t border-zinc-100 pt-5">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
                    <span>
                      ★{" "}
                      {project.githubData?.stars.toLocaleString() ?? "—"}
                    </span>

                    <span>
                      {project.githubData?.forks.toLocaleString() ?? "—"} forks
                    </span>

                    {project.githubData?.language && (
                      <span>{project.githubData.language}</span>
                    )}

                    {project.githubData?.license && (
                      <span>{project.githubData.license}</span>
                    )}

                    {project.githubData?.updatedAt && (
                      <span>
                        Updated{" "}
                        {formatUpdatedDate(project.githubData.updatedAt)}
                      </span>
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

          {/* Empty state */}
          {projects.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <p className="text-sm text-zinc-500">
                No projects have been added yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-t border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Explore by topic
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Find your corner of open source
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-950"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              About
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Open source is full of interesting things.
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-600">
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
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Linkredibles</p>

          <div className="flex gap-5">
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
          </div>
        </div>
      </footer>
    </main>
  );
}