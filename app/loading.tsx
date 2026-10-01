export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-[var(--muted)] border border-[var(--border)] animate-pulse" />
        <div className="w-64 h-4 rounded-full bg-[var(--muted)] border border-[var(--border)] animate-pulse" />
        <div className="w-40 h-4 rounded-full bg-[var(--muted)] border border-[var(--border)] animate-pulse" />
      </div>
    </div>
  );
}