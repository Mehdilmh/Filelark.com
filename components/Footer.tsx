import Link from 'next/link';
import { CATEGORIES, toolsByCategory } from '@/lib/tools';
import { SITE_NAME } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-content px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const tools = toolsByCategory(cat);
            const shown = cat === 'Image Converters' ? tools.slice(0, 8) : tools;
            return (
              <div key={cat}>
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{cat}</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {shown.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/${t.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400">
                        {t.short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{SITE_NAME}</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400">About</Link></li>
              <li><Link href="/blog" className="hover:text-brand-600 dark:hover:text-brand-400">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} {SITE_NAME}. All conversions run locally in your browser — your files never leave your device.
        </p>
      </div>
    </footer>
  );
}
