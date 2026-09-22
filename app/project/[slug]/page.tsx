import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProjects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const { getProjectSlugs } = await import("@/lib/projects");

  return getProjectSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} — Linkredibles`,
      description: project.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${project.name} — Linkredibles`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const formatUpdatedDate = (date: string) => {
    const days = Math.round(
      (new Date(date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    return new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(days, "day");
  };

  const relatedProjects = projects
    .filter(
      (item) =>
        item.slug !== project.slug &&
        item.categories.some((category) =>
          project.categories.includes(category)
        )
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:pt-14">
        {/* Back navigation */}
        <div>
          <Link
            href="/#discover"
            className="inline-flex items-center text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            ← Back to discover
          </Link>
        </div>

        {/* Hero */}
        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="max-w-4xl">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              {project.categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category}`}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium capitalize text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-950"
                >
                  {category.replace("-", " ")}
                </Link>
              ))}

              {project.featured && (
                <span className="ml-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                  Editor&apos;s pick
                </span>
              )}
            </div>

            {/* Project name */}
            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl md:text-7xl">
              {project.name}
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-3xl text-xl leading-9 text-zinc-600 md:text-2xl md:leading-10">
              {project.description}
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-wrap gap-3">
            {project.website && (
                <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                Visit website
                <span className="ml-2">↗</span>
                </a>
            )}

            <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
            >
                View on GitHub
                <span className="ml-2">↗</span>
            </a>

            <Link
                href="/#discover"
                className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
            >
                Discover more
            </Link>
            </div>
          </div>

          {/* Quick facts */}
          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Project details
            </p>

            <div className="mt-6 divide-y divide-zinc-200">
              <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                <span className="text-sm text-zinc-500">Stars</span>

                <span className="text-sm font-semibold text-zinc-950">
                  {project.githubData?.stars.toLocaleString() ?? "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-zinc-500">Forks</span>

                <span className="text-sm font-semibold text-zinc-950">
                  {project.githubData?.forks.toLocaleString() ?? "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-zinc-500">Language</span>

                <span className="text-right text-sm font-semibold text-zinc-950">
                  {project.githubData?.language ?? "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-zinc-500">Updated</span>

                <span className="text-right text-sm font-semibold text-zinc-950">
                  {project.githubData?.updatedAt
                    ? formatUpdatedDate(project.githubData.updatedAt)
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                <span className="text-sm text-zinc-500">License</span>

                <span className="max-w-[160px] text-right text-sm font-semibold text-zinc-950">
                  {project.githubData?.license ?? "—"}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Editorial section */}
        <div className="mt-24 grid gap-14 border-t border-zinc-200 pt-16 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
              The Linkredibles take
            </p>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Why it&apos;s worth knowing.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              {project.why ?? project.description}
            </p>
          </div>
        </div>

        {/* Topics */}
        {project.tags.length > 0 && (
          <div className="mt-20 grid gap-14 border-t border-zinc-200 pt-16 md:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                Topics
              </p>
            </div>

            <div className="flex max-w-3xl flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Repository */}
        <div className="mt-20 border-t border-zinc-200 pt-16">
          <div className="rounded-2xl bg-zinc-950 p-8 text-white md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Open source repository
                </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                    Explore the source behind {project.name}.
                    </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                Read the source, explore the project, and see how it is
                being developed on GitHub.
                </p>
              </div>

              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Visit repository
                <span className="ml-2">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-24 border-t border-zinc-200 pt-16">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Keep exploring
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  You might also like.
                </h2>
              </div>

              <Link
                href="/#discover"
                className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
              >
                Browse all projects →
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.slug}
                  href={`/project/${relatedProject.slug}`}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600">
                      {relatedProject.categories[0]?.replace("-", " ")}
                    </span>

                    <span className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950">
                      →
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {relatedProject.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {relatedProject.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span>
                      ★{" "}
                      {relatedProject.githubData?.stars.toLocaleString() ??
                        "—"}
                    </span>

                    {relatedProject.githubData?.language && (
                      <span>{relatedProject.githubData.language}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-zinc-950">Linkredibles</span>{" "}
            — Discover open-source projects worth knowing.
          </p>

          <Link
            href="/#discover"
            className="transition hover:text-zinc-950"
          >
            Back to discovery →
          </Link>
        </div>
      </footer>
    </main>
  );
}



