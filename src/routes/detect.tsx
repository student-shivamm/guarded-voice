import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, RotateCcw, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { UploadBox } from "@/components/site/UploadBox";
import { AudioPlayer } from "@/components/site/AudioPlayer";
import { ProcessLoader } from "@/components/site/Loader";
import { detectDeepfake } from "@/services/api";
import type { DeepfakeResponse } from "@/types/api";

export const Route = createFileRoute("/detect")({
  head: () => ({ meta: [{ title: "Audio Detection — DeepGuard AI" }] }),
  component: DetectPage,
});

function DetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DeepfakeResponse | null>(null);
  const navigate = useNavigate();

  async function analyze() {
    if (!file) return toast.error("Please upload an audio file first");
    setBusy(true); setResult(null);
    try {
      const res = await detectDeepfake(file);
      setResult(res);
    } catch (e) {
      toast.error((e as Error).message || "Detection failed");
    } finally { setBusy(false); }
  }

  function reset() { setFile(null); setResult(null); }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-primary" /> Stage 1
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Deepfake Audio Detection</h1>
          <p className="mt-2 text-muted-foreground">Upload a suspicious audio clip — we'll classify it as real or synthetic.</p>
        </div>

        {!busy && !result && (
          <div className="space-y-5">
            <UploadBox file={file} onFile={setFile} label="Drop suspicious audio here" />
            {file && <AudioPlayer blob={file} />}
            <div className="flex justify-center gap-3">
              <button
                onClick={analyze}
                disabled={!file}
                className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition disabled:opacity-50"
              >
                Analyze Audio <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm hover:bg-muted">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        )}

        {busy && <ProcessLoader />}

        {result && <ResultCard result={result} onReset={reset} onContinue={() => navigate({ to: "/verify" })} suspiciousFile={file} />}
      </section>
    </PageShell>
  );
}

function ResultCard({ result, onReset, onContinue, suspiciousFile }: {
  result: DeepfakeResponse;
  onReset: () => void;
  onContinue: () => void;
  suspiciousFile: File | null;
}) {
  const fake = result.prediction === "DEEPFAKE";

  // Stash suspicious file in sessionStorage as data URL for next step (frontend-only flow)
  function handleContinue() {
    if (!suspiciousFile) return onContinue();
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem("dg_suspicious", reader.result as string);
      sessionStorage.setItem("dg_suspicious_name", suspiciousFile.name);
      onContinue();
    };
    reader.readAsDataURL(suspiciousFile);
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-card ${
      fake ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"
    }`}>
      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${
        fake ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"
      } shadow-glow`}>
        {fake ? <ShieldAlert className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
      </div>
      <h2 className="mt-5 text-2xl font-bold">
        {fake ? "Deepfake Detected" : "Audio is Real"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {fake ? "This audio appears to be synthetically generated." : "This audio appears to be authentic."}
      </p>

      <div className="mx-auto mt-6 max-w-xs">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Confidence</span>
          <span className="font-mono text-foreground">{result.confidence.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full ${fake ? "bg-destructive" : "bg-success"}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {fake ? (
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
            <RotateCcw className="h-4 w-4" /> Start Over
          </button>
        ) : (
          <>
            <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
              Continue to Speaker Verification <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-muted">
              <RotateCcw className="h-4 w-4" /> New Audio
            </button>
          </>
        )}
      </div>

      <Link to="/about" className="mt-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline">
        How does this work?
      </Link>
    </div>
  );
}
