import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Uploading audio",
  "Extracting MFCC features",
  "Running detection model",
  "Generating result",
];

export function ProcessLoader() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass mx-auto w-full max-w-md rounded-2xl p-6">
      <ul className="space-y-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span className={`grid h-6 w-6 place-items-center rounded-full ${
              i < step ? "bg-success text-success-foreground"
                : i === step ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i === step ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : i + 1}
            </span>
            <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
