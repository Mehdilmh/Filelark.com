export default function TrustBadges({ serverSide = false }: { serverSide?: boolean }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
      <span>
        {serverSide
          ? '🔒 Encrypted — images analysed, never stored'
          : '🔒 Files never leave your device'}
      </span>
      <span>⚡ Instant</span>
      <span>🆓 Free forever</span>
    </div>
  );
}
