import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface Props {
  title: string;
  message?: string;
  icon?: LucideIcon;
}

export default function EmptyState({ title, message, icon: Icon = Inbox }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-ivory/60 px-6 py-10 text-center">
      <Icon className="h-7 w-7 text-ink-faint" aria-hidden />
      <p className="text-sm font-semibold text-ink">{title}</p>
      {message && <p className="max-w-md text-sm text-ink-soft">{message}</p>}
    </div>
  );
}
