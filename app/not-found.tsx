import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        The tool you&apos;re looking for doesn&apos;t exist — but we probably have one that does the job.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Browse all tools
      </Link>
    </div>
  );
}
