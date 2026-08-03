import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/data/categories";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </span>
            <span>{SITE.name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{SITE.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-primary">All categories</Link>
            </li>
            <li>
              <Link to="/breeds" className="hover:text-primary">Breed database</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary">Blog</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-primary">Search</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Legal
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">Terms</Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. Made with ♥ for pets everywhere.</p>
          <p>Tools are informational and not a substitute for veterinary advice.</p>
        </div>
      </div>
    </footer>
  );
}
