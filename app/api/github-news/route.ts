import { NextResponse } from "next/server";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  pushed_at: string | null;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
};

const CATEGORY_QUERIES: Record<string, string> = {
  explore: "stars:>50",
};

function getTrendingQuery() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 7);

  const dateString = date.toISOString().slice(0, 10);

  return `stars:>100 pushed:>${dateString}`;
}

function mapRepository(repo: GitHubRepository) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    owner: repo.owner.login,
    avatarUrl: repo.owner.avatar_url,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") ?? "explore";
  const query = searchParams.get("q")?.trim() ?? "";

  const baseQuery =
    category === "trending"
      ? getTrendingQuery()
      : CATEGORY_QUERIES[category] ?? CATEGORY_QUERIES.explore;

  const finalQuery = query
    ? `${baseQuery} ${query}`
    : baseQuery;

  const params = new URLSearchParams({
    q: finalQuery,
    per_page: "30",
    page: "1",
  });

  if (category === "trending") {
    params.set("sort", "stars");
    params.set("order", "desc");
  } else {
    params.set("sort", "updated");
    params.set("order", "desc");
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?${params.toString()}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Linkredibles-News",
      },
      next: {
        revalidate: 900,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "GitHub API request failed.",
        status: response.status,
      },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    category,
    total: data.total_count ?? 0,
    repositories: (data.items ?? []).map(mapRepository),
    fetchedAt: new Date().toISOString(),
  });
}