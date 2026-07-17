'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert } from './shared';
import { downloadBlob } from '@/lib/convert/util';

const DOCX_ACCEPT =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx';

export default function DocxToHtmlWidget() {
  const [busy, setBusy] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [fileName, setFileName] = useState('article');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [view, setView] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!/\.docx$/i.test(file.name)) {
      setErrors([
        `"${file.name}" is not a .docx file. From Google Docs use File → Download → Microsoft Word (.docx); legacy .doc files need to be re-saved as .docx first.`,
      ]);
      return;
    }
    setBusy(true);
    setErrors([]);
    setWarnings([]);
    setHtml(null);
    try {
      // The "browser" field of the mammoth package resolves to its browser build
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer(),
      });
      if (!result.value.trim()) {
        setErrors([`"${file.name}" appears to be empty or could not be read.`]);
      } else {
        setHtml(result.value);
        setFileName(file.name.replace(/\.docx$/i, ''));
        setWarnings(
          [...new Set(result.messages.map((m) => m.message))].slice(0, 3),
        );
      }
    } catch {
      setErrors([`"${file.name}" could not be converted. The file may be corrupt.`]);
    }
    setBusy(false);
  }

  function downloadHtml() {
    if (!html) return;
    const doc = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${fileName}</title>\n</head>\n<body>\n${html}\n</body>\n</html>\n`;
    downloadBlob(new Blob([doc], { type: 'text/html' }), `${fileName}.html`);
  }

  return (
    <div>
      <DropZone
        accept={DOCX_ACCEPT}
        multiple={false}
        onFiles={handleFiles}
        hint="Word document (.docx)"
        disabled={busy}
      />

      {busy && (
        <p className="mt-4 animate-pulse text-sm text-slate-500 dark:text-slate-400">
          Converting document…
        </p>
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />

      {html && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex gap-2">
              {(['preview', 'html'] as const).map((v) => (
                <button
                  key={v}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    view === v
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setView(v)}
                >
                  {v === 'preview' ? 'Preview' : 'HTML code'}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                className="btn-secondary text-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(html);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {
                    /* clipboard blocked */
                  }
                }}
              >
                {copied ? '✓ Copied' : 'Copy HTML'}
              </button>
              <button className="btn-primary text-sm" onClick={downloadHtml}>
                Download .html
              </button>
            </div>
          </div>

          {warnings.length > 0 && (
            <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">
              Note: {warnings.join(' · ')}
            </p>
          )}

          {view === 'preview' ? (
            <div
              className="prose-section max-h-[28rem] overflow-auto rounded-xl border border-slate-200 bg-white p-6 [&_a]:text-brand-600 [&_a]:underline [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc dark:border-slate-800 dark:bg-slate-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="max-h-[28rem] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {html}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
