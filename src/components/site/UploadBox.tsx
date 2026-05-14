import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileAudio, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  file: File | null;
  onFile: (f: File | null) => void;
  label?: string;
}

const ACCEPTED = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/x-wav", "audio/wave"];
const MAX_MB = 25;

export function UploadBox({ file, onFile, label = "Drop audio file here" }: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (f: File | null) => {
      if (!f) return onFile(null);
      if (!ACCEPTED.includes(f.type) && !/\.(wav|mp3)$/i.test(f.name)) {
        toast.error("Only WAV or MP3 files are supported");
        return;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`File too large (max ${MAX_MB}MB)`);
        return;
      }
      onFile(f);
    },
    [onFile],
  );

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          handle(e.dataTransfer.files?.[0] ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-muted/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,audio/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileAudio className="h-8 w-8 text-primary" />
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFile(null); }}
              className="ml-2 rounded-full p-1 hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-hero text-primary-foreground shadow-glow">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">WAV or MP3 · up to {MAX_MB}MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
