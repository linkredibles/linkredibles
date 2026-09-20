import Link from "next/link";

import { getCategories } from "@/lib/categories";

export default function CategoriesPage() {
  const categories = getCategories();

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
            Explore by topic
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Categories
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-600">
            Explore open-source projects across the areas that matter to
            you.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  {category.name}
                </h2>

                <span className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950">
                  →
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {category.description}
              </p>
            </Link>
          ))}
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