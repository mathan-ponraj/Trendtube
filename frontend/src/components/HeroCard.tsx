import { compact } from "../utils/format";

interface Props {
  views: number;
  videos: number;
  regions: number;
}

/** Illustrated headline card (cartoon beach scene) showing combined recorded views. */
export default function HeroCard({ views, videos, regions }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-brand-100 to-teal-50 p-5 shadow-card">
      <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-brand-700">Combined views</span>

      <svg viewBox="0 0 320 150" className="mt-1 w-full" aria-hidden>
        <circle cx="252" cy="42" r="32" fill="#FFF1B8" opacity="0.75" />
        <circle cx="252" cy="42" r="21" fill="#FFE08A" />
        <g fill="#FFFFFF">
          <ellipse cx="96" cy="40" rx="30" ry="12" />
          <circle cx="82" cy="33" r="12" />
          <circle cx="108" cy="30" r="14" />
        </g>
        <path d="M0 98 Q40 78 80 98 T160 98 T240 98 T320 98 V150 H0Z" fill="#BFE6F0" />
        <ellipse cx="74" cy="118" rx="54" ry="13" fill="#FBE7B5" />
        <path d="M74 114 Q80 90 70 68" stroke="#D9B382" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g transform="translate(70 68)" fill="#8ED4A4">
          <ellipse cx="-15" cy="-2" rx="17" ry="6" transform="rotate(-20 -15 -2)" />
          <ellipse cx="15" cy="-2" rx="17" ry="6" transform="rotate(20 15 -2)" />
          <ellipse cx="0" cy="-11" rx="6" ry="15" />
        </g>
        <path d="M0 122 Q40 105 80 122 T160 122 T240 122 T320 122 V150 H0Z" fill="#9ED8E6" />
        <circle cx="200" cy="132" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="214" cy="140" r="2.5" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      </svg>

      <p className="font-display text-4xl font-semibold tracking-tight text-brand-700">{compact(views)}</p>
      <p className="mt-1 text-sm text-ink-soft">
        recorded across {videos.toLocaleString("en-US")} trending videos in {regions} regions
      </p>
    </div>
  );
}
