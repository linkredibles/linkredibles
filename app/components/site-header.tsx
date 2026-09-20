import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="shrink-0">
          <Image
            src="/Linkredibles-logo.png"
            alt="Linkredibles"
            width={200}
            height={75}
            priority
            className="h-auto w-[150px] md:w-[170px]"
          />
        </Link>

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

          <Link
            href="/submit"
            className="rounded-full bg-zinc-950 px-4 py-2.5 text-white transition hover:bg-zinc-800"
          >
            Submit project
          </Link>
        </nav>
      </div>
    </header>
  );
}