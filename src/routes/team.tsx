import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — DeepGuard AI" }] }),
  component: Team,
});

const members = [
  { name: "Team Member 1", role: "ML Engineer", initials: "M1" },
  { name: "Team Member 2", role: "Frontend Developer", initials: "M2" },
  { name: "Team Member 3", role: "Research Lead", initials: "M3" },
  { name: "Team Member 4", role: "Audio Engineer", initials: "M4" },
];

function Team() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">The team</h1>
        <p className="mt-3 text-muted-foreground">A small group of students building DeepGuard AI as a final-year ML project.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <div key={m.name} className="group rounded-2xl border bg-card p-6 text-center shadow-card transition hover:-translate-y-1">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-hero text-xl font-bold text-primary-foreground shadow-glow">
                {m.initials}
              </div>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
