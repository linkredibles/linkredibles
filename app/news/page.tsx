import NewsBrowser from "./news-browser";

export const metadata = {
  title: "GitHub News — Linkredibles",
  description:
    "Discover interesting, trending, and recently active open-source projects from GitHub.",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 md:pb-16 md:pt-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              GitHub discovery
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              What&apos;s happening on GitHub.
            </h1>

            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Discover interesting repositories, emerging projects, and
              open-source activity across the GitHub ecosystem.
            </p>
          </div>
        </div>
      </section>

      <NewsBrowser />
    </main>
  );
}
