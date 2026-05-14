import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "./AudioPlayer";
import { Waveform } from "./Waveform";

export function Recorder({ onRecorded }: { onRecorded: (b: Blob | null) => void }) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b); onRecorded(b);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setRecording(true); setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access denied");
    }
  }

  function stop() {
    recRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function reset() { setBlob(null); onRecorded(null); setSeconds(0); }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex flex-col items-center gap-4">
        {recording ? (
          <>
            <Waveform bars={32} />
            <p className="font-mono text-sm text-muted-foreground">{seconds}s</p>
            <button onClick={stop} className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2 text-sm font-medium text-destructive-foreground shadow-soft">
              <Square className="h-4 w-4" /> Stop
            </button>
          </>
        ) : blob ? (
          <>
            <AudioPlayer blob={blob} />
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm hover:bg-muted">
              <Trash2 className="h-4 w-4" /> Re-record
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Record a live reference voice sample</p>
            <button onClick={start} className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95">
              <Mic className="h-4 w-4" /> Start recording
            </button>
          </>
        )}
      </div>
    </div>
  );
}
