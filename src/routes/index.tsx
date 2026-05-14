import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Mic, Activity, Cpu, ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Waveform } from "@/components/site/Waveform";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: ShieldCheck, title: "Deepfake Detection", desc: "Identify synthetic audio with confidence scoring." },
  { icon: Mic, title: "Speaker Verification", desc: "Match voiceprints against a reference sample." },
  { icon: Activity, title: "Real-time Analysis", desc: "Stream audio in and get results in seconds." },
  { icon: Cpu, title: "Lightweight Architecture", desc: "MFCC features + compact models, edge friendly." },
];

function Landing() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl float-blob" />
        <div className="pointer-events-none absolute top-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl float-blob" style={{ animationDelay: "4s" }} />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Dual-stage AI authentication
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Integrated <span className="gradient-text">Deepfake Audio Detection</span> & Speaker Verification
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered dual-stage authentication system using MFCC-based analysis.
            Detect synthetic voices and verify the real speaker in one seamless flow.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/detect" className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
              Start Detection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-card">
              View Project
            </Link>
          </div>

          <div className="glass mx-auto mt-16 max-w-3xl rounded-3xl p-6">
            <Waveform bars={64} className="h-20" />
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Live waveform · MFCC pipeline</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:gradient-hero group-hover:text-primary-foreground transition">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How DeepGuard works</h2>
          <p className="mt-2 text-muted-foreground">A two-stage pipeline that's simple from the outside, sophisticated underneath.</p>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {[
            { n: "01", t: "Upload audio", d: "Drop a suspicious WAV or MP3 file." },
            { n: "02", t: "Detect deepfake", d: "Model returns REAL or DEEPFAKE with confidence." },
            { n: "03", t: "Verify speaker", d: "If real, verify identity against a reference voice." },
          ].map((s) => (
            <li key={s.n} className="rounded-2xl border bg-card p-6 shadow-card">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
