'use client';

import dynamic from 'next/dynamic';
import type { Tool } from '@/lib/tools';

/**
 * Client-side dispatcher. Each widget is a separate chunk so tool pages stay
 * light; the heavy codec libraries (pdf.js, heic2any, jszip, AVIF WASM) are
 * loaded even later — only when a file is actually dropped.
 */

const loading = () => (
  <div className="flex min-h-[220px] animate-pulse items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
    Loading tool…
  </div>
);

const ImageConvertWidget = dynamic(() => import('./ImageConvertWidget'), { ssr: false, loading });
const ImageResizeWidget = dynamic(() => import('./ImageResizeWidget'), { ssr: false, loading });
const ImageCompressWidget = dynamic(() => import('./ImageCompressWidget'), { ssr: false, loading });
const PdfToImagesWidget = dynamic(() => import('./PdfToImagesWidget'), { ssr: false, loading });
const ImagesToPdfWidget = dynamic(() => import('./ImagesToPdfWidget'), { ssr: false, loading });
const MergePdfWidget = dynamic(() => import('./MergePdfWidget'), { ssr: false, loading });
const SplitPdfWidget = dynamic(() => import('./SplitPdfWidget'), { ssr: false, loading });
const CompressPdfWidget = dynamic(() => import('./CompressPdfWidget'), { ssr: false, loading });
const RotatePdfWidget = dynamic(() => import('./RotatePdfWidget'), { ssr: false, loading });
const ImageToPromptWidget = dynamic(() => import('./ImageToPromptWidget'), { ssr: false, loading });

export default function ToolWidget({ tool }: { tool: Tool }) {
  switch (tool.kind) {
    case 'image-convert':
      return <ImageConvertWidget from={tool.from} to={tool.to} />;
    case 'image-resize':
      return <ImageResizeWidget />;
    case 'image-compress':
      return <ImageCompressWidget />;
    case 'pdf-to-images':
      return <PdfToImagesWidget />;
    case 'images-to-pdf':
      return <ImagesToPdfWidget />;
    case 'merge-pdf':
      return <MergePdfWidget />;
    case 'split-pdf':
      return <SplitPdfWidget />;
    case 'compress-pdf':
      return <CompressPdfWidget />;
    case 'rotate-pdf':
      return <RotatePdfWidget />;
    case 'image-to-prompt':
      return <ImageToPromptWidget defaultStyle={tool.promptStyle ?? 'generic'} />;
  }
}
