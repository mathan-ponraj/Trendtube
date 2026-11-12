export default function LoadingState({ height = 160, label = "Loading" }: { height?: number; label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      style={{ height }}
      className="w-full animate-pulse rounded-xl bg-gradient-to-r from-[#E3F2F0] via-[#EEF8F6] to-[#E3F2F0]"
    />
  );
}
