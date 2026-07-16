import { Faq } from '@/lib/content';

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.question}
            className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900 dark:text-white">
              {f.question}
              <span className="ml-4 text-slate-400 transition group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
