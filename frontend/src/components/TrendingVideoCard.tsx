import { ExternalLink, Eye, MessageSquare, ThumbsUp } from "lucide-react";
import type { Video } from "../types";
import { compact, duration } from "../utils/format";

export default function TrendingVideoCard({ video }: { video: Video }) {
  const length = duration(video.duration_seconds);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition hover:shadow-md">
      <div className="relative aspect-video bg-ivory">
        <img
          src={video.thumbnail_url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
        />
        <span className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-0.5 text-xs font-semibold text-ink shadow-sm">
          #{video.rank} in {video.region_code}
        </span>
        {length && (
          <span className="absolute bottom-2 right-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs font-medium text-white">{length}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink" title={video.title ?? undefined}>
            {video.title ?? "Untitled video"}
          </h3>
          <p className="mt-1 truncate text-sm text-ink-soft">{video.channel_name ?? "Unknown channel"}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-600">{video.region_name} &middot; {video.continent ?? "-"}</span>
          <span className="rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-500">{video.category_name}</span>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs text-ink-soft">
          <Metric icon={Eye} label="Views" value={compact(video.view_count)} />
          <Metric icon={ThumbsUp} label="Likes" value={video.like_count > 0 ? compact(video.like_count) : "Hidden"} />
          <Metric icon={MessageSquare} label="Comments" value={video.comment_count > 0 ? compact(video.comment_count) : "-"} />
        </dl>

        <a
          href={video.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          Watch on YouTube <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-ink-faint"><Icon className="h-3.5 w-3.5" aria-hidden />{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
