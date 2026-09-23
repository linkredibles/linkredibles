import { NextResponse } from "next/server";

const GITHUB_OWNER = "linkredibles";
const GITHUB_REPO = "linkredibles";

type ReportBody = {
  projectName?: string;
  projectSlug?: string;
  githubUrl?: string;
  reason?: string;
  details?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReportBody;

    const projectName = body.projectName?.trim();
    const projectSlug = body.projectSlug?.trim();
    const githubUrl = body.githubUrl?.trim();
    const reason = body.reason?.trim();
    const details = body.details?.trim();

    if (!projectName || !projectSlug || !githubUrl || !reason) {
      return NextResponse.json(
        { error: "Missing required report information." },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_REPORT_TOKEN;

    if (!token) {
      console.error("GITHUB_REPORT_TOKEN is not configured.");

      return NextResponse.json(
        { error: "Report service is not configured." },
        { status: 500 }
      );
    }

    const projectUrl = `https://www.linkredibles.com/project/${encodeURIComponent(
      projectSlug
    )}`;

    const issueBody = [
      `## Project`,
      ``,
      `**Name:** ${projectName}`,
      `**Linkredibles page:** ${projectUrl}`,
      `**GitHub:** ${githubUrl}`,
      ``,
      `## Report`,
      ``,
      `**Reason:** ${reason}`,
      ``,
      `**Additional details:**`,
      details || "_No additional details provided._",
      ``,
      `---`,
      ``,
      `This report was submitted through Linkredibles.`,
    ].join("\n");

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `[Broken Link] ${projectName}`,
          body: issueBody,
          labels: ["broken-link"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `GitHub issue creation failed: ${response.status}`,
        errorText
      );

      return NextResponse.json(
        { error: "Could not create the report." },
        { status: 502 }
      );
    }

    const issue = (await response.json()) as {
      html_url?: string;
    };

    return NextResponse.json({
      success: true,
      issueUrl: issue.html_url ?? null,
    });
  } catch (error) {
    console.error("Report submission failed:", error);

    return NextResponse.json(
      { error: "Could not submit the report." },
      { status: 500 }
    );
  }
}