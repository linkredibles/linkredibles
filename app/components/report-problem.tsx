"use client";

import { useState } from "react";

type ReportProblemProps = {
  projectName: string;
  projectSlug: string;
  githubUrl: string;
};

const reasons = [
  "GitHub repository not found",
  "Website not working",
  "Project moved",
  "Repository is private",
  "Other",
];

export default function ReportProblem({
  projectName,
  projectSlug,
  githubUrl,
}: ReportProblemProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");

    try {
      const response = await fetch("/api/report-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          projectSlug,
          githubUrl,
          reason,
          details,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setStatus("success");
      setDetails("");
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <div className="mt-16 border-t border-zinc-200 pt-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
        >
          <span aria-hidden="true">⚠</span>
          Report a problem
        </button>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-zinc-200 pt-8">
      <div className="max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Report a problem
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Let us know if something about this project appears to be
              outdated or broken.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-zinc-400 transition hover:text-zinc-950"
          >
            Close
          </button>
        </div>

        {status === "success" ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="font-medium text-zinc-950">Thanks for the report.</p>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              We&apos;ll review the project and check the reported problem.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="report-reason"
                className="block text-sm font-medium text-zinc-950"
              >
                What is wrong?
              </label>

              <select
                id="report-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-details"
                className="block text-sm font-medium text-zinc-950"
              >
                Additional details{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>

              <textarea
                id="report-details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={4}
                placeholder="Tell us what you found..."
                className="mt-2 w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-500"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600">
                Something went wrong while submitting the report. Please try
                again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Submit report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}