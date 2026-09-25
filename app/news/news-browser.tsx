"use client";

import { useEffect, useMemo, useState } from "react";

type Repository = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  pushedAt: string | null;
  createdAt: string;
  owner: string;
  avatarUrl: string;
};

const tabs = [
  { id: "explore", label: "Explore" },
  { id: "trending", label: "Trending" },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  }).format(
    Math.round((date.getTime() - Date.now()) / 86400000),
    "day"
  );
}

function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <article className="group flex min-h-[310px] flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
            {repository.owner}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-600"
            >
              {repository.name}
            </a>
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          ? {formatNumber(repository.stars)}
        </span>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-zinc-600">
        {repository.description || "No description provided."}
      </p>

      {repository.topics.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {repository.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-zinc-100 pt-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
          {repository.language && <span>{repository.language}</span>}

          <span>{formatNumber(repository.forks)} forks</span>

          <span>
            Updated{" "}
            {repository.pushedAt
              ? formatDate(repository.pushedAt)
              : formatDate(repository.updatedAt)}
          </span>
        </div>

        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-zinc-950 transition hover:underline"
        >
          View on GitHub
          <span className="ml-2">?</span>
        </a>
      </div>
    </article>
  );
}

function RepositoryListItem({
  repository,
}: {
  repository: Repository;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white px-5 py-5 transition hover:border-zinc-300 hover:shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
              {repository.owner}
            </p>

            <span className="text-xs text-zinc-400">
              {formatNumber(repository.stars)} stars
            </span>

            <span className="text-xs text-zinc-400">
              {formatNumber(repository.forks)} forks
            </span>

            {repository.language && (
              <span className="text-xs text-zinc-400">
                {repository.language}
              </span>
            )}
          </div>

          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-600"
            >
              {repository.name}
            </a>
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {repository.description || "No description provided."}
          </p>

          {repository.topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {repository.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-500"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-950 hover:underline"
          >
            View on GitHub ?
          </a>
        </div>
      </div>
    </article>
  );
}

export default function NewsBrowser() {
  const [activeTab, setActiveTab] = useState("explore");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "card">("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/github-news?category=${encodeURIComponent(activeTab)}`
        );

        if (!response.ok) {
          throw new Error("Unable to load GitHub data.");
        }

        const data = await response.json();

        if (!cancelled) {
          setRepositories(data.repositories ?? []);
        }
      } catch {
        if (!cancelled) {
          setRepositories([]);
          setError(
            "GitHub could not be reached right now. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const filteredRepositories = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return repositories;
    }

    return repositories.filter((repository) => {
      const searchable = [
        repository.name,
        repository.fullName,
        repository.description ?? "",
        repository.language ?? "",
        repository.topics.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }, [repositories, search]);

  return (
    <>
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6">
          <div className="flex min-w-max gap-2 py-4">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="max-w-2xl">
          <label htmlFor="news-search" className="sr-only">
            Search GitHub news
          </label>

          <input
            id="news-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-sm font-medium text-zinc-700">{error}</p>
          </div>
        ) : filteredRepositories.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                {filteredRepositories.length} repositories
              </p>

              <div className="flex items-center gap-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                  Live from GitHub
                </p>

                <div className="flex rounded-lg border border-zinc-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      view === "list"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    List
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("card")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      view === "card"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>
            </div>

            {view === "list" ? (
              <div className="space-y-3">
                {filteredRepositories.map((repository) => (
                  <RepositoryListItem
                    key={repository.id}
                    repository={repository}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRepositories.map((repository) => (
                  <RepositoryCard
                    key={repository.id}
                    repository={repository}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-sm font-medium text-zinc-700">
              No repositories found.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
