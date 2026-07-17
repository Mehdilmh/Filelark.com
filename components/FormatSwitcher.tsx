import Link from 'next/link';
import { FORMATS, INPUT_FORMATS, OUTPUT_FORMATS } from '@/lib/formats';
import { getTool, Tool } from '@/lib/tools';

function Pill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  if (active) {
    return (
      <span className="rounded-full bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
    >
      {label}
    </Link>
  );
}

/**
 * Quick format chooser shown on conversion pages: pick a different source or
 * target format without searching — each pill links to the matching page.
 */
export default function FormatSwitcher({ tool }: { tool: Tool }) {
  if (tool.kind !== 'image-convert' || !tool.from || !tool.to) return null;

  const from = FORMATS[tool.from];
  const to = FORMATS[tool.to];

  return (
    <div className="mb-8 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Convert {from.name} to:
        </span>
        {OUTPUT_FORMATS.filter((f) => f !== tool.from).map((f) => (
          <Pill
            key={f}
            href={`/${tool.from}-to-${f}`}
            label={FORMATS[f].name}
            active={f === tool.to}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Convert to {to.name} from:
        </span>
        {INPUT_FORMATS.filter((f) => f !== tool.to && getTool(`${f}-to-${tool.to}`)).map((f) => (
          <Pill
            key={f}
            href={`/${f}-to-${tool.to}`}
            label={FORMATS[f].name}
            active={f === tool.from}
          />
        ))}
      </div>
    </div>
  );
}
