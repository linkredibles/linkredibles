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
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
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
      title: "Project not found | Linkredibles",
    };
  }

  return {
    title: `${project.name} | Linkredibles`,
    description: project.description,
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

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight"
        >
          linkredibles
        </Link>

        <Link
          href="/#discover"
          className="text-sm text-zinc-600 transition hover:text-zinc-950"
        >
          ← Back to discover
        </Link>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            {project.categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${category}`}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600 transition hover:bg-zinc-200"
              >
                {category.replace("-", " ")}
              </Link>
            ))}

            {project.featured && (
              <span className="text-xs font-medium text-zinc-400">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-7 text-5xl font-semibold tracking-tight sm:text-6xl">
            {project.name}
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-600">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              View on GitHub
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>

        <div className="mt-16 border-y border-zinc-200 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                Stars
              </p>

              <p className="mt-2 text-xl font-semibold">
                {project.githubData?.stars.toLocaleString() ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                Forks
              </p>

              <p className="mt-2 text-xl font-semibold">
                {project.githubData?.forks.toLocaleString() ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                Language
              </p>

              <p className="mt-2 text-xl font-semibold">
                {project.githubData?.language ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                Updated
              </p>

              <p className="mt-2 text-xl font-semibold">
                {project.githubData?.updatedAt
                  ? formatUpdatedDate(project.githubData.updatedAt)
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                License
              </p>

              <p className="mt-2 text-xl font-semibold">
                {project.githubData?.license ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
            About this project
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Why it&apos;s on Linkredibles
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            {project.description}
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500">
          © 2026 Linkredibles
        </div>
      </footer>
    </main>
  );
}