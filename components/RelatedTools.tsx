import { relatedTools, Tool } from '@/lib/tools';
import ToolCard from './ToolCard';

export default function RelatedTools({ tool }: { tool: Tool }) {
  const related = relatedTools(tool);
  if (related.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        People also use…
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
