import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Cpu, Layers, Shield, Workflow } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — DeepGuard AI" }] }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About the project</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          DeepGuard AI is a college research project exploring dual-stage audio
          authentication: detecting synthetic (deepfake) audio and verifying
          speaker identity using compact, MFCC-based machine learning models.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { icon: Workflow, t: "Two-stage pipeline", d: "Detection first, identity verification second — only when audio passes the first gate." },
            { icon: Cpu, t: "MFCC features", d: "Mel-frequency cepstral coefficients capture spectral shape used by both classifiers." },
            { icon: Shield, t: "Defense oriented", d: "Designed for fraud prevention, voice-based KYC, and call-center authentication." },
            { icon: Layers, t: "Lightweight", d: "Compact model footprint enables edge and on-device inference." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="text-xl font-semibold">Architecture</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><span className="font-mono text-primary">01</span> · Audio ingested via upload or microphone capture</li>
            <li><span className="font-mono text-primary">02</span> · Preprocessing &amp; MFCC feature extraction</li>
            <li><span className="font-mono text-primary">03</span> · Deepfake classifier returns label + confidence</li>
            <li><span className="font-mono text-primary">04</span> · If real, speaker embedding compared with reference</li>
            <li><span className="font-mono text-primary">05</span> · Final verdict surfaced to user with similarity score</li>
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
