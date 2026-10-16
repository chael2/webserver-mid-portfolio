import { FaGithub, FaRss } from "react-icons/fa6";
import { getProfile } from "@/lib/queries";

export default async function Footer() {
  const profile = await getProfile();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div>
          <div className="logo">{profile.handle}</div>
          <p className="mt-1 text-sm text-muted">
            © 2026 {profile.name}({profile.handle}). Built with Next.js · MongoDB · Tailwind CSS
          </p>
        </div>
        <div className="flex gap-2 text-xl">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-full text-muted transition hover:text-accent">
            <FaGithub />
          </a>
          <a href={profile.links.blog} target="_blank" rel="noopener noreferrer" aria-label="Blog" className="grid size-11 place-items-center rounded-full text-muted transition hover:text-secondary">
            <FaRss />
          </a>
        </div>
      </div>
    </footer>
  );
}
