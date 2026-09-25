"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/Linkredibles-logo.png"
            alt="Linkredibles"
            width={200}
            height={75}
            priority
            className="h-auto w-[150px] md:w-[170px]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
          <Link
            href="/#discover"
            className="transition-colors hover:text-zinc-950"
          >
            Discover
          </Link>

          <Link
            href="/categories"
            className="transition-colors hover:text-zinc-950"
          >
            Categories
          </Link>

          <Link
            href="/news"
            className="transition-colors hover:text-zinc-950"
          >
            News
          </Link>

          <Link
            href="/#about"
            className="transition-colors hover:text-zinc-950"
          >
            About
          </Link>

          <Link
            href="/projects"
            className="transition-colors hover:text-zinc-950"
          >
            Search
          </Link>

          <a
            href="https://github.com/linkredibles/linkredibles"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkredibles GitHub repository"
            className="transition-colors hover:text-zinc-950"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <a
            href="https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-950 px-4 py-2.5 text-white transition hover:bg-zinc-800"
          >
            Submit project
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 md:hidden"
        >
          <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>

          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium text-zinc-700">
            <Link
              href="/#discover"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              Discover
            </Link>

            <Link
              href="/categories"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              Categories
            </Link>

            <Link
              href="/news"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              News
            </Link>

            <Link
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              About
            </Link>

            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              Search
            </Link>

            <a
              href="https://github.com/linkredibles/linkredibles"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-zinc-950 px-4 py-3 text-center text-white transition hover:bg-zinc-800"
            >
              Submit project
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
