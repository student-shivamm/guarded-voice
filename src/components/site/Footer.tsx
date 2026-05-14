export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} DeepGuard AI — Academic ML Project</p>
        <p>Dual-stage deepfake audio authentication · MFCC-based</p>
      </div>
    </footer>
  );
}
