"use client";

import { useState } from "react";
import Link from "next/link";

export type GrowthProject = {
  slug: string;
  name: string;
  description: string;
  github: string;
  gain: number;
  stars: number;
  forks?: number;
  language?: string | null;
  license?: string | null;
  updatedAt?: string;
  categories?: string[];
  tags?: string[];
  rankingLabel?: string;
};

type Period = "today" | "week" | "month";
type Discovery = "rising" | "recentlyUpdated" | "hiddenGems" | "mostStarred";
type DiscoveryProjectKey = Exclude<Discovery, "rising">;

const periods: { id: Period; label: string; explanation: string }[] = [
  { id: "today", label: "Today", explanation: "the last 24 hours" },
  { id: "week", label: "This week", explanation: "the last 7 days" },
  { id: "month", label: "This month", explanation: "the last 30 days" },
];

const discoveryOptions: { id: Discovery; label: string }[] = [
  { id: "rising", label: "Rising" },
  { id: "recentlyUpdated", label: "Recently updated" },
  { id: "hiddenGems", label: "Hidden gems" },
  { id: "mostStarred", label: "Most starred" },
];

function formatUpdatedAt(value?: string) {
  if (!value) return "Update date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Update date unavailable";

  return `Updated ${date.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })}`;
}

export default function TrendingPeriodTabs({
  growthByPeriod,
  discoveryProjects,
}: {
  growthByPeriod: Record<Period, GrowthProject[]>;
  discoveryProjects: Record<DiscoveryProjectKey, GrowthProject[]>;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("today");
  const [selectedDiscovery, setSelectedDiscovery] =
    useState<Discovery>("rising");

  const projects =
    selectedDiscovery === "rising"
      ? growthByPeriod[selectedPeriod]
      : discoveryProjects[selectedDiscovery];

  const period = periods.find((item) => item.id === selectedPeriod)!;
  const discovery = discoveryOptions.find(
    (item) => item.id === selectedDiscovery
  )!;

  const hasVerifiedGrowth =
    selectedDiscovery === "rising" &&
    projects.some((project) => project.gain > 0);

  const rankingLabel = projects[0]?.rankingLabel;

  const heading =
    selectedDiscovery === "rising"
      ? hasVerifiedGrowth
        ? "Repositories gaining stars"
        : rankingLabel ?? "Popular projects"
      : `${discovery.label} projects`;

  let explanation: string;

  if (selectedDiscovery === "rising" && hasVerifiedGrowth) {
    explanation = `Ranked by verified star gains over ${period.explanation}.`;
  } else if (selectedDiscovery === "rising") {
    explanation = rankingLabel
      ? `Star-growth rankings are still building. Showing ${rankingLabel.toLowerCase()} projects in the meantime.`
      : "Star-growth rankings will appear as historical data builds up.";
  } else if (selectedDiscovery === "recentlyUpdated") {
    explanation = "Ranked by the latest available repository update timestamp.";
  } else if (selectedDiscovery === "hiddenGems") {
    explanation = "Explore smaller projects with 100 to 5,000 stars.";
  } else {
    explanation = "Ranked by total GitHub stars.";
  }

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Trending time period"
      >
        {periods.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selectedPeriod === item.id}
            onClick={() => setSelectedPeriod(item.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedPeriod === item.id
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label="Explore project rankings"
      >
        {discoveryOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selectedDiscovery === item.id}
            onClick={() => setSelectedDiscovery(item.id)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
              selectedDiscovery === item.id
                ? "border-zinc-400 bg-zinc-200 text-zinc-950"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Time periods apply to Rising. The other views use their own ranking criteria.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{heading}</h3>
            <span className="text-xs text-zinc-500">
              {projects.length} repositories
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600">{explanation}</p>
        </div>

        {projects.length === 0 ? (
          <p className="p-6 text-sm leading-6 text-zinc-600">
            {selectedDiscovery === "rising"
              ? `There are not enough recorded snapshots to verify growth over ${period.explanation} yet. Run your existing GitHub stats updater as scheduled snapshots accumulate.`
              : "No projects are available for this ranking yet."}
          </p>
        ) : (
          <ol className="divide-y divide-zinc-100">
            {projects.map((project, index) => (
              <li
                key={project.slug}
                className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 px-4 py-4 transition hover:bg-zinc-50 sm:grid-cols-[1.5rem_minmax(0,1fr)_8rem] sm:items-start"
              >
                <span className="pt-1 text-sm tabular-nums text-zinc-400">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/project/${project.slug}`}
                      className="font-semibold text-zinc-950 hover:underline"
                    >
                      {project.name}
                    </Link>
                    {project.language && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        {project.language}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-zinc-600">
                    {project.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span>Stars: {project.stars.toLocaleString()}</span>
                    <span>Forks: {(project.forks ?? 0).toLocaleString()}</span>
                    {project.license && <span>{project.license}</span>}
                    <span>{formatUpdatedAt(project.updatedAt)}</span>
                  </div>

                  {!!project.categories?.length && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.categories.slice(0, 3).map((category) => (
                        <Link
                          key={category}
                          href={`/categories/${category}`}
                          className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
                        >
                          {category.replace(/-/g, " ")}
                        </Link>
                      ))}
                    </div>
                  )}

                  {!!project.tags?.length && (
                    <p className="mt-2 line-clamp-1 text-xs text-zinc-400">
                      {project.tags.slice(0, 4).join(" · ")}
                    </p>
                  )}

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950"
                  >
                    View on GitHub
                  </a>
                </div>

                <div className="col-start-2 mt-3 sm:col-start-auto sm:mt-0 sm:text-right">
                  {hasVerifiedGrowth ? (
                    <span className="text-sm font-semibold text-emerald-700">
                      +{project.gain.toLocaleString()} stars
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500">
                      {project.rankingLabel ??
                        (selectedDiscovery === "rising"
                          ? "Current ranking"
                          : discovery.label)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}