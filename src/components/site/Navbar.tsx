import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/detect", label: "Detection" },
  { to: "/verify", label: "Verification" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-hero shadow-glow">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="tracking-tight">DeepGuard <span className="gradient-text">AI</span></span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            to="/detect"
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            Start
          </Link>
        </nav>
      </div>
    </header>
  );
}
