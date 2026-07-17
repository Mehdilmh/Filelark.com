'use client';

import { useState } from 'react';

interface ExamplePrompt {
  style: 'Midjourney' | 'Stable Diffusion' | 'Description';
  text: string;
}

const PROMPTS: ExamplePrompt[] = [
  {
    style: 'Midjourney',
    text: 'golden retriever puppy leaping through autumn leaves, low-angle action shot, warm backlight, shallow depth of field, kodak portra tones --ar 3:2 --v 7',
  },
  {
    style: 'Stable Diffusion',
    text: 'cyberpunk street market at night, neon signs, rain-slicked pavement, cinematic lighting, volumetric fog, ultra detailed, 8k, sharp focus',
  },
  {
    style: 'Description',
    text: 'A minimalist Scandinavian living room bathed in soft morning light, pale oak floors, a sage-green linen sofa, and a single monstera casting long shadows on a white wall.',
  },
  {
    style: 'Midjourney',
    text: 'isometric cutaway of a cozy bookshop café, miniature diorama style, warm tungsten glow, tilt-shift photography, intricate details --ar 1:1 --v 7',
  },
  {
    style: 'Stable Diffusion',
    text: 'portrait of an elderly fisherman, weathered skin, salt-and-pepper beard, dramatic rembrandt lighting, oil painting style, textured brushstrokes, masterpiece',
  },
  {
    style: 'Midjourney',
    text: 'bioluminescent jellyfish drifting through a midnight ocean, ethereal teal glow, macro photography, inky black background, particles of light --ar 9:16 --v 7',
  },
  {
    style: 'Description',
    text: 'An art-deco travel poster of a seaside city at golden hour: bold geometric sunbeams, terracotta rooftops, a vintage tram winding toward the harbor.',
  },
  {
    style: 'Stable Diffusion',
    text: 'ancient stone temple overgrown with cherry blossoms, misty mountains, studio ghibli style, soft pastel palette, hand-painted look, dreamy atmosphere',
  },
  {
    style: 'Midjourney',
    text: 'product shot of a matte-black espresso machine, floating coffee beans, dark moody studio, dramatic rim lighting, commercial photography --ar 4:3 --v 7',
  },
  {
    style: 'Description',
    text: 'A watercolor illustration of a red fox curled asleep in fresh snow, loose expressive washes, cool blue shadows, and a single warm accent on its fur.',
  },
  {
    style: 'Stable Diffusion',
    text: 'astronaut tending a greenhouse on mars, golden sunset through glass dome, cinematic composition, hyperrealistic, depth of field, award-winning photo',
  },
  {
    style: 'Midjourney',
    text: 'paper-cut layered art of a whale beneath ocean waves, deep blue gradient, soft drop shadows, intricate craft detail, studio lighting --ar 16:9 --v 7',
  },
];

const STYLE_COLORS: Record<ExamplePrompt['style'], string> = {
  Midjourney: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  'Stable Diffusion': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Description: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
};

function PromptCard({ prompt }: { prompt: ExamplePrompt }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:w-[380px]">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLE_COLORS[prompt.style]}`}>
          {prompt.style}
        </span>
        <button
          className="text-xs font-medium text-slate-400 transition hover:text-brand-600 dark:hover:text-brand-400"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(prompt.text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard blocked */
            }
          }}
          aria-label="Copy prompt"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="line-clamp-4 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {prompt.text}
      </p>
    </div>
  );
}

function MarqueeRow({
  prompts,
  reverse = false,
}: {
  prompts: ExamplePrompt[];
  reverse?: boolean;
}) {
  return (
    <div className="group overflow-hidden" aria-hidden={false}>
      <div
        className={`flex w-max gap-4 py-2 ${reverse ? 'animate-marquee-fast [animation-direction:reverse]' : 'animate-marquee-slow'} group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none`}
      >
        {/* content duplicated once for a seamless loop */}
        {[...prompts, ...prompts].map((p, i) => (
          <PromptCard key={i} prompt={p} />
        ))}
      </div>
    </div>
  );
}

/**
 * Animated, two-row marquee of example AI prompts. Rows drift in opposite
 * directions, pause on hover, and respect prefers-reduced-motion.
 */
export default function PromptShowcase() {
  const half = Math.ceil(PROMPTS.length / 2);
  return (
    <div className="relative">
      <MarqueeRow prompts={PROMPTS.slice(0, half)} />
      <MarqueeRow prompts={PROMPTS.slice(half)} reverse />
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent dark:from-slate-950 sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent dark:from-slate-950 sm:w-24" />
    </div>
  );
}
