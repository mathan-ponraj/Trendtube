import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-6 py-8 text-center">
      <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden />
      <p className="max-w-md text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-ivory"
        >
          <RotateCw className="h-4 w-4" aria-hidden /> Try again
        </button>
      )}
    </div>
  );
}
