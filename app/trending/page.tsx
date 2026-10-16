import fs from "fs";
import path from "path";
import Link from "next/link";
import { getProjects, type Project } from "@/lib/projects";
import TrendingPeriodTabs, { type GrowthProject } from "@/app/components/trending-period-tabs";

export const metadata = {
  title: "Trending Open-Source Projects | Linkredibles",
  description: "Explore popular open-source repositories, recently updated projects, hidden gems, and verified star growth.",
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

function growthForWindow(
  projects: Project[],
  history: History,
  days: number,
  now: Date
): GrowthProject[] {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  const cutoffDate = cutoff.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  const recentLimit = new Date(now);
  recentLimit.setUTCDate(recentLimit.getUTCDate() - 2);
  const recentDate = recentLimit.toISOString().slice(0, 10);

  return projects.flatMap((project) => {
    const snapshots = [...(history[project.slug] ?? [])]
      .filter((item) => item.date <= today)
      .sort((a, b) => a.date.localeCompare(b.date));

    const latest = snapshots[snapshots.length - 1];
    const baseline = snapshots.filter((item) => item.date <= cutoffDate).at(-1);

    if (
      !latest ||
      !baseline ||
      latest.date <= cutoffDate ||
      latest.date < recentDate
    ) {
      return [];
    }

    const gain = latest.stars - baseline.stars;
    if (gain <= 0) return [];

    return [{
      slug: project.slug,
      name: project.name,
      description: project.description,
      github: project.github,
      gain,
      stars: project.githubData?.stars ?? latest.stars,
      forks: project.githubData?.forks ?? 0,
      language: project.githubData?.language ?? null,
      license: project.githubData?.license ?? null,
      updatedAt: project.githubData?.updatedAt,
      categories: project.categories,
      tags: project.tags,
    }];
  }).sort((a, b) => b.gain - a.gain);
}

export default async function TrendingPage() {
  const projects = await getProjects();
  const history = readHistory();
  const now = new Date();

  const mostStarred = [...projects].sort(
    (a, b) => (b.githubData?.stars ?? 0) - (a.githubData?.stars ?? 0)
  ).slice(0, 20);

  const recentlyUpdated = [...projects]
    .filter((project) => project.githubData?.updatedAt)
    .sort((a, b) =>
      (b.githubData?.updatedAt ?? "").localeCompare(a.githubData?.updatedAt ?? "")
    )
    .slice(0, 20);

  const hiddenGems = [...projects]
    .filter((project) => {
      const stars = project.githubData?.stars ?? 0;
      return stars >= 100 && stars <= 5000;
    })
    .sort((a, b) =>
      (b.githubData?.stars ?? 0) - (a.githubData?.stars ?? 0)
    )
    .slice(0, 20);

  const toGrowthProject = (project: Project, gain = 0): GrowthProject => ({
    slug: project.slug,
    name: project.name,
    description: project.description,
    github: project.github,
    gain,
    stars: project.githubData?.stars ?? 0,
    forks: project.githubData?.forks ?? 0,
    language: project.githubData?.language ?? null,
    license: project.githubData?.license ?? null,
    updatedAt: project.githubData?.updatedAt,
    categories: project.categories,
    tags: project.tags,
  });

  const verifiedGrowthByPeriod = {
    today: growthForWindow(projects, history, 1, now),
    week: growthForWindow(projects, history, 7, now),
    month: growthForWindow(projects, history, 30, now),
  };

  // Use verified star growth when available. Otherwise, show real catalogue
  // projects ranked by current stars, clearly labelled as discovery fallback.
  const fallbackTrending = mostStarred.map((project) => ({
    ...toGrowthProject(project),
    rankingLabel: "Most starred",
  }));
  const growthByPeriod = {
    today: verifiedGrowthByPeriod.today.length
      ? verifiedGrowthByPeriod.today
      : fallbackTrending,
    week: verifiedGrowthByPeriod.week.length
      ? verifiedGrowthByPeriod.week
      : fallbackTrending,
    month: verifiedGrowthByPeriod.month.length
      ? verifiedGrowthByPeriod.month
      : fallbackTrending,
  };

  const discoveryProjects = {
    recentlyUpdated: recentlyUpdated.map((project) => ({
      ...toGrowthProject(project),
      rankingLabel: "Recently updated",
    })),
    hiddenGems: hiddenGems.map((project) => ({
      ...toGrowthProject(project),
      rankingLabel: "Hidden gem",
    })),
    mostStarred: mostStarred.map((project) => ({
      ...toGrowthProject(project),
      rankingLabel: "Most starred",
    })),
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <Link href="/#discover" className="text-sm text-zinc-600 transition hover:text-zinc-950">
          Back to discover
        </Link>

        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            The open-source pulse
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Trending projects
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Discover popular repositories, recent activity, and promising smaller projects across the Linkredibles collection.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-200 px-3 py-1">{projects.length} curated projects</span>
            <Link href="/insights" className="rounded-full border border-zinc-200 px-3 py-1 hover:bg-zinc-50">
              Explore collection insights
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Rising repositories</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Verified growth uses recorded star-count snapshots. Until enough history is available, the list shows popular projects from the Linkredibles collection.
          </p>
          <div className="mt-5">
            <TrendingPeriodTabs growthByPeriod={growthByPeriod} discoveryProjects={discoveryProjects} />
          </div>
        </section>




        <p className="mt-12 text-xs leading-5 text-zinc-500">
          Star counts and update timestamps reflect the latest available GitHub stats. Recent update time is not the same as star growth. Growth rankings appear when snapshots cover the requested period.
        </p>
      </section>
    </main>
  );
}
