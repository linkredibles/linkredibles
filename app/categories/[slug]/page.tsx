import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories";
import { getProjects } from "@/lib/projects";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const categories = getCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const categories = getCategories();
  const projects = await getProjects();

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProjects = projects.filter((project) =>
    project.categories.includes(category.slug)
  );

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <a
          href="/"
          className="text-xl font-semibold tracking-tight"
        >
          linkredibles
        </a>

        <a
          href="/categories"
          className="text-sm text-zinc-600 transition hover:text-zinc-950"
        >
          ← Back to categories
        </a>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
            Category
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            {category.name}
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-600">
            {category.description}
          </p>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Projects
            </h2>

            <span className="text-sm text-zinc-500">
              {categoryProjects.length}{" "}
              {categoryProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {categoryProjects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-zinc-200 p-8 text-zinc-600">
              No projects in this category yet.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {categoryProjects.map((project) => (
                <a
                  key={project.slug}
                  href={`/project/${project.slug}`}
                  className="group rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {project.featured && (
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight transition group-hover:text-zinc-600">
                    {project.name}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-600">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
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
                </a>
              ))}
            </div>
          )}
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

