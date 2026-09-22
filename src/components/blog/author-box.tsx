import { Link } from "@tanstack/react-router";
import { type Author, DEFAULT_AUTHOR } from "@/data/authors";
import { ExternalLink, ArrowRight } from "lucide-react";

// Official LinkedIn and Instagram SVGs
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function AuthorBox({
  author = DEFAULT_AUTHOR,
  className = "",
}: {
  author?: Author;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-7 ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Author Avatar */}
        <Link
          to={`/author/${author.slug}`}
          className="group relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-sm transition hover:border-primary/50 sm:size-24"
        >
          <img
            src={author.avatar}
            alt={author.name}
            className="size-full object-cover object-center transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to initials if image fails
              const target = e.currentTarget;
              target.style.display = "none";
            }}
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Written by
              </div>
              <Link
                to={`/author/${author.slug}`}
                className="font-display text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {author.role}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {author.shortBio}
          </p>

          {/* Social Links & Author Profile CTA */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
            <div className="flex items-center gap-3">
              {author.socials.linkedin && (
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 hover:text-[#0077b5]"
                  aria-label={`${author.name} on LinkedIn`}
                >
                  <LinkedInIcon className="size-3.5 fill-current" />
                  <span>LinkedIn</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              )}
              {author.socials.instagram && (
                <a
                  href={author.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:text-[#E1306C]"
                  aria-label={`${author.name} on Instagram`}
                >
                  <InstagramIcon className="size-3.5 fill-current" />
                  <span>Instagram</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              )}
            </div>

            <Link
              to={`/author/${author.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Author Profile & Articles</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
