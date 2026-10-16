import fs from "fs";
import path from "path";
import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { getCategories } from "@/lib/categories";

export const metadata = {
  title: "Open-Source Insights — Linkredibles",
  description: "Explore statistics, language distribution, star ranges, and tracking coverage across the Linkredibles project collection.",
};

type Snapshot = { date: string; stars: number };
type History = Record<string, Snapshot[]>;

function readHistory(): History {
  const file = path.join(process.cwd(), "content", "github-star-history.json");
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as History;
  } catch {
    return {};
  }
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 p-6">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-5 text-zinc-500">{detail}</p>
    </article>
  );
}

export default async function InsightsPage() {
  const projects = await getProjects();
  const categories = getCategories();
  const history = readHistory();

  const totalStars = projects.reduce(
    (sum, project) => sum + (project.githubData?.stars ?? 0),
    0
  );

  const languages = new Map<string, number>();
  for (const project of projects) {
    const language = project.githubData?.language || "Unknown";
    languages.set(language, (languages.get(language) ?? 0) + 1);
  }
  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const starRanges = [
    { label: "Under 100", min: 0, max: 99 },
    { label: "100–999", min: 100, max: 999 },
    { label: "1,000–9,999", min: 1000, max: 9999 },
    { label: "10,000+", min: 10000, max: Infinity },
  ].map((range) => ({
    ...range,
    count: projects.filter((project) => {
      const stars = project.githubData?.stars ?? 0;
      return stars >= range.min && stars <= range.max;
    }).length,
  }));

  const projectsWithStats = projects.filter((project) => project.githubData).length;
  const projectsWithHistory = Object.values(history).filter((items) => items.length > 0).length;
  const projectsWithMultipleSnapshots = Object.values(history).filter((items) => items.length >= 2).length;
  const totalSnapshots = Object.values(history).reduce((sum, items) => sum + items.length, 0);
  const categoryCounts = new Map<string, number>();

  for (const project of projects) {
    for (const category of project.categories) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }

  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const languageMax = Math.max(1, ...topLanguages.map((item) => item[1]));
  const starMax = Math.max(1, ...starRanges.map((item) => item.count));
  const categoryMax = Math.max(1, ...topCategories.map((item) => item[1]));

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <Link href="/#discover" className="text-sm text-zinc-600 transition hover:text-zinc-950">
          Back to discover
        </Link>

        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            The numbers behind the ecosystem
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Project insights
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            A snapshot of the open-source projects in Linkredibles, from language distribution to popularity and data coverage.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Collection overview</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Curated projects" value={projects.length.toLocaleString()} detail="Projects currently in the directory" />
            <Metric label="Categories" value={categories.length.toLocaleString()} detail="Available discovery categories" />
            <Metric label="Total GitHub stars" value={totalStars.toLocaleString()} detail="Sum of latest available project counts" />
            <Metric label="Stats coverage" value={`${projects.length ? Math.round(projectsWithStats / projects.length * 100) : 0}%`} detail={`${projectsWithStats} projects with GitHub stats`} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Languages</h2>
          <p className="mt-2 text-sm text-zinc-600">Primary language reported by GitHub. Unknown values are included separately.</p>
          <div className="mt-5 space-y-4 rounded-2xl border border-zinc-200 p-6">
            {topLanguages.map(([language, count]) => (
              <div key={language}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <span className="font-medium">{language}</span>
                  <span className="text-zinc-500">{count} projects</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-zinc-800" style={{ width: `${count / languageMax * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Star distribution</h2>
          <p className="mt-2 text-sm text-zinc-600">How many listed repositories fall into each current star-count range.</p>
          <div className="mt-5 space-y-4 rounded-2xl border border-zinc-200 p-6">
            {starRanges.map((range) => (
              <div key={range.label}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <span className="font-medium">{range.label}</span>
                  <span className="text-zinc-500">{range.count} projects</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-zinc-800" style={{ width: `${range.count / starMax * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Popular categories</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {topCategories.map(([category, count]) => (
              <Link key={category} href={`/categories/${category}`} className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:bg-zinc-50">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium capitalize">{category.replace(/-/g, " ")}</span>
                  <span className="text-sm text-zinc-500">{count}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-zinc-800" style={{ width: `${count / categoryMax * 100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Tracking health</h2>
          <p className="mt-2 text-sm text-zinc-600">Historical snapshots are needed before star-growth and language-momentum trends can be calculated.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Projects with history" value={projectsWithHistory.toLocaleString()} detail="At least one saved star-count snapshot" />
            <Metric label="Multiple snapshots" value={projectsWithMultipleSnapshots.toLocaleString()} detail="Projects with enough records to begin comparisons" />
            <Metric label="Saved snapshots" value={totalSnapshots.toLocaleString()} detail="Records currently available in the history file" />
          </div>
          {projectsWithMultipleSnapshots === 0 && (
            <p className="mt-5 rounded-xl border border-zinc-200 p-5 text-sm leading-6 text-zinc-600">
              Growth and momentum charts are not shown yet because the history currently contains baseline snapshots only. As future runs of the existing GitHub stats updater record more data, these comparisons can become available without changing the project import process.
            </p>
          )}
        </section>

        <div className="mt-12">
          <Link href="/trending" className="inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">
            Explore trending projects
          </Link>
        </div>
      </section>
    </main>
  );
}