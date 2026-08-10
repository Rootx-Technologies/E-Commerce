export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
