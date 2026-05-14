import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — DeepGuard AI" }] }),
  component: Team,
});

const members = [
  { name: "Lucky", role: "2022UIC3504", initials: "L" },
  { name: "Shivam Bajaj", role: "2022UIC3539", initials: "SB" },
  { name: "Saaransh Jain", role: "2022UIC3542", initials: "SJ" },
  { name: "Atul Kumar", role: "2022UIC4014", initials: "AK" },
];

function Team() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Submitted By</h1>
        <p className="mt-3 text-muted-foreground">DeepGuard AI — Final-year ML project team.</p>

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
