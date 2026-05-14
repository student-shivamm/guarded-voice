import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw, UserCheck, UserX, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { UploadBox } from "@/components/site/UploadBox";
import { AudioPlayer } from "@/components/site/AudioPlayer";
import { Recorder } from "@/components/site/Recorder";
import { ProcessLoader } from "@/components/site/Loader";
import { verifySpeaker } from "@/services/api";
import type { SpeakerResponse } from "@/types/api";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Speaker Verification — DeepGuard AI" }] }),
  component: VerifyPage,
});

function dataUrlToBlob(durl: string): Blob {
  const [meta, b64] = durl.split(",");
  const mime = /:(.*?);/.exec(meta)?.[1] ?? "audio/wav";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function VerifyPage() {
  const [suspicious, setSuspicious] = useState<Blob | null>(null);
  const [suspiciousName, setSuspiciousName] = useState<string>("suspicious.wav");
  const [reference, setReference] = useState<Blob | null>(null);
  const [refFile, setRefFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"upload" | "record">("upload");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SpeakerResponse | null>(null);

  useEffect(() => {
    const d = sessionStorage.getItem("dg_suspicious");
    const n = sessionStorage.getItem("dg_suspicious_name");
    if (d) setSuspicious(dataUrlToBlob(d));
    if (n) setSuspiciousName(n);
  }, []);

  useEffect(() => { if (refFile) setReference(refFile); }, [refFile]);

  async function verify() {
    if (!suspicious) return toast.error("No suspicious audio found. Run detection first.");
    if (!reference) return toast.error("Provide a reference voice sample.");
    setBusy(true); setResult(null);
    try {
      const res = await verifySpeaker(suspicious, reference);
      setResult(res);
    } catch (e) {
      toast.error((e as Error).message || "Verification failed");
    } finally { setBusy(false); }
  }

  function retry() { setResult(null); setReference(null); setRefFile(null); }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-primary" /> Stage 2
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Speaker Verification</h1>
          <p className="mt-2 text-muted-foreground">Provide a reference voice — we'll compare voiceprints.</p>
        </div>

        {!suspicious && !busy && !result && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5 text-center text-sm">
            No suspicious audio found.{" "}
            <Link to="/detect" className="font-medium text-primary underline-offset-4 hover:underline">Run detection first</Link>.
          </div>
        )}

        {suspicious && !busy && !result && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Suspicious sample</p>
              <p className="mt-1 truncate font-medium">{suspiciousName}</p>
              <div className="mt-3"><AudioPlayer blob={suspicious} /></div>
            </div>

            <div>
              <div className="mb-3 flex justify-center gap-2">
                {(["upload", "record"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 text-sm transition ${
                    mode === m ? "bg-primary text-primary-foreground shadow-soft" : "border hover:bg-muted"
                  }`}>{m === "upload" ? "Upload reference" : "Record live"}</button>
                ))}
              </div>
              {mode === "upload" ? (
                <>
                  <UploadBox file={refFile} onFile={setRefFile} label="Drop reference voice sample" />
                  {refFile && <div className="mt-4"><AudioPlayer blob={refFile} /></div>}
                </>
              ) : (
                <Recorder onRecorded={setReference} />
              )}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={verify}
                disabled={!reference}
                className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                Verify Speaker <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={retry} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm hover:bg-muted">
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>
        )}

        {busy && <ProcessLoader />}

        {result && <SpeakerResult result={result} onRetry={retry} />}
      </section>
    </PageShell>
  );
}

function SpeakerResult({ result, onRetry }: { result: SpeakerResponse; onRetry: () => void }) {
  const ok = result.match;
  return (
    <div className={`rounded-3xl border p-8 text-center shadow-card ${
      ok ? "border-success/30 bg-success/5" : "border-warning/40 bg-warning/10"
    }`}>
      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl shadow-glow ${
        ok ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
      }`}>
        {ok ? <UserCheck className="h-8 w-8" /> : <UserX className="h-8 w-8" />}
      </div>
      <h2 className="mt-5 text-2xl font-bold">{ok ? "Verified Speaker" : "Different Speaker"}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {ok ? "Voiceprint matches the reference sample." : "Voiceprint does not match the reference."}
      </p>

      <div className="mx-auto mt-6 max-w-xs">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Similarity</span>
          <span className="font-mono text-foreground">{result.similarity.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${ok ? "bg-success" : "bg-warning"}`} style={{ width: `${result.similarity}%` }} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-muted">
          <RotateCcw className="h-4 w-4" /> Try another reference
        </button>
        <Link to="/detect" className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
          New Detection
        </Link>
      </div>
    </div>
  );
}
