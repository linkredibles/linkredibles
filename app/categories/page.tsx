import Link from "next/link";
import { getCategories } from "@/lib/categories";

export default function CategoriesPage() {
  const categories = getCategories();

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
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
            Explore
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Categories
          </h1>

          <p className="mt-6 text-xl leading-8 text-zinc-600">
            Explore open-source projects by category.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {category.name}
              </h2>

              <p className="mt-3 leading-7 text-zinc-600">
                {category.description}
              </p>

              <span className="mt-6 inline-block text-sm font-medium text-zinc-500 transition group-hover:text-zinc-950">
                Explore category →
              </span>
            </Link>
          ))}
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