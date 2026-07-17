import Link from 'next/link';
import { Tool } from '@/lib/tools';

const ICONS: Record<string, string> = {
  'Image Converters': '🖼️',
  'Image Tools': '✂️',
  'PDF Tools': '📄',
  'AI Tools': '✨',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500"
    >
      <span className="text-xl" aria-hidden>
        {ICONS[tool.category]}
      </span>
      <span>
        <span className="block font-semibold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {tool.short}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
          Free · No upload
        </span>
      </span>
    </Link>
  );
}
