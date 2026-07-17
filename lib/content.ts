import { FORMATS } from './formats';
import { SITE_NAME, SITE_URL } from './site';
import { Tool } from './tools';

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

const PRIVACY_PARAGRAPH =
  `Unlike most online converters, ${SITE_NAME} never uploads your files to a server. ` +
  `The conversion runs entirely inside your browser using modern web technology, which means it works offline once the page has loaded, ` +
  `there are no file size queues or daily upload limits, and your images can never be stored, scanned, or leaked — they simply never leave your device.`;

/* ------------------------------------------------------------------ */
/* Per-tool content sections (300–500 words below the widget)          */
/* ------------------------------------------------------------------ */

export function toolContent(tool: Tool): ContentSection[] {
  if (tool.kind === 'image-convert' && tool.from && tool.to) {
    const f = FORMATS[tool.from];
    const t = FORMATS[tool.to];

    const comparison: string[] = [];
    if (f.transparency && !t.transparency) {
      comparison.push(
        `Note that ${t.name} does not support transparency: any transparent areas in your ${f.name} will be filled with a white background during conversion.`,
      );
    } else if (!f.transparency && t.transparency) {
      comparison.push(
        `${t.name} supports full transparency, so images you later edit can take advantage of an alpha channel — though a converted ${f.name} starts out fully opaque.`,
      );
    } else if (f.transparency && t.transparency) {
      comparison.push(
        `Both formats support transparency, and this converter preserves the alpha channel — transparent areas in your ${f.name} stay transparent in the ${t.name}.`,
      );
    }
    if (f.lossy && !t.lossy) {
      comparison.push(
        `Because ${t.name} is lossless, the conversion will not add any new compression artifacts — but it also cannot restore detail the original ${f.name} compression already discarded.`,
      );
    } else if (!f.lossy && t.lossy) {
      comparison.push(
        `${t.name} uses lossy compression, so use the quality slider to balance file size against fidelity — 80–90% is visually indistinguishable from the original for most images.`,
      );
    }
    if (f.animation && !t.animation) {
      comparison.push(
        `For animated ${f.name} files, this tool converts the first frame — the output ${t.name} is a still image.`,
      );
    }

    return [
      {
        heading: `What is a ${f.name} file?`,
        paragraphs: [`${f.about}`, `In short, ${f.name} is ${f.pitch}. It is best for ${f.bestFor}. Its main limitations are ${f.drawbacks}.`],
      },
      {
        heading: `Why convert ${f.name} to ${t.name}?`,
        paragraphs: [
          `${t.about}`,
          `Converting from ${f.name} to ${t.name} makes sense when you need ${t.bestFor}. ${t.name} is ${t.support}.`,
          ...comparison,
        ],
      },
      {
        heading: `How to convert ${f.name} to ${t.name}`,
        paragraphs: [
          `Drag and drop one or more ${f.name} files into the box above (or click to browse). ` +
            (t.lossy ? `Adjust the quality slider if you want smaller files or higher fidelity, then` : `Then`) +
            ` press Convert. Each file is decoded and re-encoded as ${t.name} on your own device in a second or two, and you can download results individually or grab everything as a ZIP.`,
          PRIVACY_PARAGRAPH,
        ],
      },
    ];
  }

  switch (tool.kind) {
    case 'image-compress':
      return [
        {
          heading: 'Why compress images?',
          paragraphs: [
            'Oversized images are the single most common cause of slow web pages, rejected form uploads, and bloated email attachments. Compressing an image re-encodes it more efficiently — usually shaving 50–90% off the file size with little or no visible difference.',
            'This tool lets you set a target file size (for example "under 200 KB") and automatically finds the best quality level that fits. It shows the before/after sizes for every file so you can judge the tradeoff yourself.',
          ],
        },
        {
          heading: 'How it works',
          paragraphs: [
            'Drop your JPG, PNG, WebP or HEIC images above, choose a target size or quality, and press Compress. The tool progressively re-encodes each image in your browser, reducing quality and — if needed — dimensions until it hits your target.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Tips for the best results',
          paragraphs: [
            'Photographs compress far better as JPG or WebP than as PNG — if your photo is a PNG, converting it to WebP first can cut the size by 5–10× on its own. Keep PNG for screenshots, logos and graphics with sharp edges or transparency. For web use, aim for under 200 KB for large hero images and under 50 KB for thumbnails.',
          ],
        },
      ];

    case 'image-resize':
      return [
        {
          heading: 'Resize images without installing anything',
          paragraphs: [
            'Whether you need a 1200×630 social share image, a 512×512 avatar, or photos scaled down to 50%, this tool resizes images to exact dimensions right in your browser. You can set width and height in pixels (with the aspect ratio locked so nothing gets distorted) or scale by percentage.',
            'Batch resizing is supported — drop in a whole folder of photos and every one is processed with the same settings, then download them all as a ZIP.',
          ],
        },
        {
          heading: 'Pixels or percentage?',
          paragraphs: [
            'Use pixel mode when a platform demands exact dimensions — for example 1920×1080 wallpapers, 1080×1080 Instagram posts, or 16×16 favicons. Use percentage mode when you simply want smaller copies of many differently-sized photos: 50% halves both dimensions and cuts the pixel count to a quarter.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Does resizing reduce quality?',
          paragraphs: [
            'Scaling an image down re-samples it, which is generally safe — a high-resolution photo scaled to 50% still looks crisp. Scaling up cannot invent detail that was never captured, so enlarged images look soft. This tool uses high-quality resampling to keep downscaled images as sharp as possible.',
          ],
        },
      ];

    case 'pdf-to-images':
      return [
        {
          heading: 'Turn PDF pages into images',
          paragraphs: [
            'Sometimes you need a PDF as pictures: to post a page on social media, embed it in a slide deck, mark it up in an image editor, or upload it to a form that only accepts JPG or PNG. This tool renders each page of your PDF as a high-resolution image using the same engine Firefox uses to display PDFs.',
            'Choose JPG for smaller files (best for pages with photos) or PNG for pixel-perfect quality (best for pages with fine text and line art). Every page is rendered at high resolution so text stays sharp.',
          ],
        },
        {
          heading: 'How to convert a PDF to JPG or PNG',
          paragraphs: [
            'Drop a PDF into the box above, pick your output format and quality, and press Convert. Each page appears as a downloadable image, and multi-page documents can be downloaded as a single ZIP.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Is this safe for confidential documents?',
          paragraphs: [
            'Yes — and this is exactly the situation where a browser-based tool matters. Contracts, invoices, IDs and medical documents are processed entirely on your own computer. Nothing is transmitted, so there is no server copy to be retained, breached, or subpoenaed.',
          ],
        },
      ];

    case 'images-to-pdf':
      return [
        {
          heading: 'Combine images into one PDF',
          paragraphs: [
            'Turn a batch of photos, scans, or screenshots into a single tidy PDF — perfect for submitting receipts, sharing a scanned document, or archiving a photo set. JPG, PNG, WebP, and even iPhone HEIC photos are all accepted.',
            'Each image becomes one page, sized to match the image itself so nothing is cropped or letterboxed. Drag files up and down in the list to set the page order before you convert.',
          ],
        },
        {
          heading: 'How it works',
          paragraphs: [
            'Drop your images above, arrange them in order, and press Create PDF. The document is assembled in your browser using a proven PDF library and downloads instantly.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Quality and file size',
          paragraphs: [
            'JPG images are embedded directly into the PDF without re-encoding, so there is zero quality loss and no size bloat. PNG images are embedded losslessly as well. If your source photos are very large and you want a smaller PDF, run them through the image compressor first, then build the PDF.',
          ],
        },
      ];

    case 'merge-pdf':
      return [
        {
          heading: 'Merge PDFs in seconds',
          paragraphs: [
            'Combine contracts, reports, scans, or chapters into one document. Drop in two or more PDFs, drag them into the right order, and merge — the pages are copied losslessly, so text stays selectable and nothing is re-compressed.',
            'There is no page limit and no file size cap beyond what your device can handle, because there is no server doing the work.',
          ],
        },
        {
          heading: 'Your documents stay private',
          paragraphs: [
            PRIVACY_PARAGRAPH,
            'That makes this tool safe for the documents people most often need to merge — leases, invoices, legal filings, and medical records.',
          ],
        },
        {
          heading: 'Frequently merged, frequently asked',
          paragraphs: [
            'The merged PDF preserves each source document exactly: bookmarks-level fidelity of page content, embedded fonts, and images. Password-protected PDFs need to be unlocked before merging. If you only need some pages from a document, use the Split PDF tool first to extract them, then merge the pieces.',
          ],
        },
      ];

    case 'split-pdf':
      return [
        {
          heading: 'Extract exactly the pages you need',
          paragraphs: [
            'Split a long PDF into pieces or pull out a page range: type ranges like "1-3, 7, 12-14" to build a new PDF from just those pages, or use split-every-page mode to explode the document into individual single-page PDFs delivered as a ZIP.',
            'Pages are copied losslessly — no re-compression, no quality change, and text remains selectable.',
          ],
        },
        {
          heading: 'How to split a PDF',
          paragraphs: [
            'Drop your PDF above. The tool shows the page count; enter the pages you want (or choose "every page separately") and press Split. Your new PDF downloads immediately.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Common uses',
          paragraphs: [
            'Sending one chapter of a report instead of the whole file; extracting a signed signature page; removing confidential sections before sharing; or breaking a 200-page scan into manageable pieces. Combine with the Merge PDF tool to rearrange documents any way you like.',
          ],
        },
      ];

    case 'compress-pdf':
      return [
        {
          heading: 'Why are PDFs so large?',
          paragraphs: [
            'Most oversized PDFs are image-heavy: scanned documents, photo reports, and slide exports embed full-resolution images on every page. Email providers often cap attachments at 25 MB and many portals at 10 MB or less, so a 60 MB scan simply will not send.',
            'This tool re-renders each page at a quality level you choose and rebuilds the PDF, which routinely shrinks scanned documents by 70–90%.',
          ],
        },
        {
          heading: 'How to compress a PDF',
          paragraphs: [
            'Drop a PDF above, choose a quality preset, and press Compress. You will see the before and after sizes so you can decide whether to go stronger or lighter. ',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'A note on text',
          paragraphs: [
            'Because compression works by re-rendering pages as images, selectable text becomes part of the page image in the output file. For scans and photo-heavy documents this is irrelevant (they are images already) — but if you need selectable text and a smaller file, try splitting the document or removing unneeded pages instead.',
          ],
        },
      ];

    case 'rotate-pdf':
      return [
        {
          heading: 'Fix sideways pages and delete the rest',
          paragraphs: [
            'Scanners and phone cameras love producing sideways or upside-down pages. This tool shows a thumbnail of every page in your PDF; rotate any page in 90° steps and mark unwanted pages for deletion, then download the corrected document.',
            'Rotation is applied losslessly as PDF metadata — page content is never re-compressed, so quality is untouched and text stays selectable.',
          ],
        },
        {
          heading: 'How it works',
          paragraphs: [
            'Drop a PDF above and wait a moment while page previews render. Click the rotate button on any page (each click turns it 90° clockwise) and the trash button to toggle deletion. Press Apply and the new PDF downloads instantly.',
            PRIVACY_PARAGRAPH,
          ],
        },
      ];

    case 'bg-remove':
      return [
        {
          heading: 'AI background removal — without uploading your photo',
          paragraphs: [
            'Every other background remover sends your image to a server for processing. This one runs the AI model (U²-Net, a widely used salient-object segmentation network) directly in your browser via WebAssembly — your photo never leaves your device, which matters when it is a photo of you, your family, or an unreleased product.',
            'The result is a PNG with a transparent background, ready for product listings, profile pictures, presentations, thumbnails, and design work. A one-click white-background JPG is also available for marketplaces that require it.',
          ],
        },
        {
          heading: 'How to remove a background',
          paragraphs: [
            'Drop an image above. The first use downloads the AI model (about 4.5 MB, cached afterwards), analysis takes a couple of seconds, and you get a live preview over a checkerboard so you can inspect the cutout before downloading.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'What to expect (an honest note)',
          paragraphs: [
            'On-device AI has real limits: clear subjects — people, products, animals, vehicles — cut out well, while very busy scenes and fine details like wispy hair or fur edges are harder and may need touch-up. Cloud services with far larger models still win on those edge cases. For most everyday cutouts, this tool gets you there in two seconds without surrendering your photo.',
          ],
        },
      ];

    case 'pdf-to-word':
      return [
        {
          heading: 'Get editable text out of any PDF',
          paragraphs: [
            'PDFs are designed to look identical everywhere — which also makes them frustrating to edit. This tool extracts the text of every page and rebuilds it as a Word (.docx) document you can open in Microsoft Word, Google Docs, or LibreOffice and edit freely.',
            'It works best on text-based PDFs: reports, contracts, essays, ebooks. The text itself is preserved faithfully, page by page.',
          ],
        },
        {
          heading: 'What to expect (an honest note)',
          paragraphs: [
            'This converter focuses on the text, not pixel-perfect layout: complex multi-column layouts, embedded images, and intricate tables are simplified to flowing paragraphs. For most editing jobs — reusing wording, updating a contract, quoting a report — that is exactly what you want. Scanned PDFs (photos of paper) contain no text layer, so they need OCR, which this tool does not perform.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'How to convert PDF to Word',
          paragraphs: [
            'Drop a PDF into the box above and press Convert. The text is extracted page by page in your browser and packaged as a .docx file that downloads instantly. Combine it with the Split PDF tool first if you only need a few pages of a long document.',
          ],
        },
      ];

    case 'docx-to-html':
      return [
        {
          heading: 'Turn articles into clean HTML',
          paragraphs: [
            'Writers draft in Word or Google Docs, but the web wants HTML — and pasting straight from Word into a CMS produces a notorious mess of inline styles and <span> soup. This tool converts a .docx file into clean, semantic HTML: headings become <h2>/<h3>, bold and italics become <strong> and <em>, lists become real <ul>/<ol>, and links survive intact.',
            'Writing in Google Docs? Use File → Download → Microsoft Word (.docx), then drop that file here.',
          ],
        },
        {
          heading: 'Why clean HTML matters for SEO',
          paragraphs: [
            'Search engines read structure, not appearance. Proper heading tags describe your content hierarchy, semantic emphasis carries meaning, and lean markup keeps pages fast. The HTML this tool produces is ready to paste into WordPress, Ghost, Webflow, Shopify blogs, or any hand-built site — with nothing to clean up.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'How it works',
          paragraphs: [
            'Drop a .docx file above. You get a live preview of the converted article, the raw HTML with a one-click copy button, and a downloadable .html file. Images embedded in the document are included inline so nothing goes missing.',
          ],
        },
      ];

    case 'video-to-mp3':
      return [
        {
          heading: 'Extract the audio from any video',
          paragraphs: [
            'Lectures, interviews, voice memos recorded as video, music in a screen recording — sometimes you only need the sound. This tool strips the video track and saves the audio as a high-quality MP3 that plays everywhere.',
            'It accepts MP4, WebM, MOV, MKV and AVI files, and the conversion runs entirely in your browser using WebAssembly — your video is never uploaded anywhere, which matters for private recordings and meetings.',
          ],
        },
        {
          heading: 'How it works (and what to expect)',
          paragraphs: [
            'Drop a video above and press Extract. The first use downloads the conversion engine (about 31 MB, cached afterwards), then audio is extracted at roughly real-time speed — a 3-minute video takes on the order of a minute. For very long recordings, trim the video first and extract just the part you need.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Audio quality',
          paragraphs: [
            'The MP3 is encoded at a high variable bitrate (roughly 190 kbps), which is transparent for speech and very good for music. Remember that extraction can never sound better than the source — a video with compressed 96 kbps audio yields an MP3 of that same underlying quality.',
          ],
        },
      ];

    case 'video-to-gif':
      return [
        {
          heading: 'Turn video clips into GIFs',
          paragraphs: [
            'GIFs still rule chats, docs, README files and anywhere autoplaying video is awkward. This tool converts a section of any video into an animated GIF with a proper optimized color palette — the two-pass technique that keeps GIFs looking crisp instead of grainy.',
            'You control the start time, duration, output width and frame rate, which are also your file-size levers: GIFs grow quickly, so short, small and 10–15 fps is usually the sweet spot.',
          ],
        },
        {
          heading: 'How to make a GIF from a video',
          paragraphs: [
            'Drop a video above, choose the section (start time and duration), pick a width and frame rate, and press Convert. The first use downloads the conversion engine (~31 MB, cached afterwards). Everything runs in your browser — nothing is uploaded.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Keeping GIF sizes sane',
          paragraphs: [
            'A 5-second clip at 480 px / 12 fps lands around 2–4 MB. Double the width or frame rate and the size roughly doubles too. If your GIF is for a chat app preview, 320 px at 10 fps looks great at a fraction of the size; for crisp UI demos, 480–640 px at 15 fps is plenty.',
          ],
        },
      ];

    case 'video-compress':
      return [
        {
          heading: 'Make videos small enough to send',
          paragraphs: [
            'Phone videos are enormous — a minute of 4K footage can top 400 MB, while WhatsApp caps files at 64 MB and email at 25 MB. This tool re-encodes video with the efficient H.264 codec at a quality level you choose, typically shrinking files by 60–90%.',
            'Everything runs in your browser via WebAssembly: your videos never touch a server, so private family clips stay private.',
          ],
        },
        {
          heading: 'How to compress a video',
          paragraphs: [
            'Drop a video above, pick a quality preset (Balanced is right for most uses), and press Compress. The first use downloads the conversion engine (~31 MB, cached afterwards). Re-encoding is CPU-intensive and runs at roughly real-time speed — a 2-minute clip takes a couple of minutes — so it is best suited to clips rather than feature films.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'Quality presets explained',
          paragraphs: [
            'Light keeps near-original quality with modest savings. Balanced is visually excellent for phones and social sharing at a fraction of the size. Strong prioritises the smallest file — fine for previews and messaging, visibly softer on large screens. If the result is still too big, also reduce the resolution by trimming your video to just the needed section first.',
          ],
        },
      ];

    case 'video-trim':
      return [
        {
          heading: 'Cut the part you actually need',
          paragraphs: [
            'A 20-minute recording where the useful part is 40 seconds; a phone clip with fumbling at both ends — trimming is the most common edit there is, and it shouldn’t require installing an editor. Enter a start and end time and get just that section.',
            'Trimming here is lossless: the video is cut without re-encoding, so it completes in seconds regardless of length and the quality is byte-for-byte identical to the original.',
          ],
        },
        {
          heading: 'How to trim a video',
          paragraphs: [
            'Drop a video above, enter start and end times (in seconds, or mm:ss), and press Trim. The first use downloads the engine (~31 MB, cached afterwards); the cut itself is nearly instant because nothing is re-encoded.',
            PRIVACY_PARAGRAPH,
          ],
        },
        {
          heading: 'One technical note',
          paragraphs: [
            'Lossless cutting can only start at a keyframe, so the actual start may land up to a couple of seconds before the time you enter (never after — you won’t lose content). For frame-exact cuts, trim slightly wide here, or run the clip through the video compressor afterwards, which re-encodes and snaps the boundaries precisely.',
          ],
        },
      ];

    case 'youtube-thumbnail':
      return [
        {
          heading: 'Every thumbnail quality, from one link',
          paragraphs: [
            'Every YouTube video stores its thumbnail at several fixed resolutions — from a tiny 120×90 preview up to the full 1280×720 HD image (present on most modern uploads). This tool takes any YouTube link — a normal watch URL, a youtu.be short link, or a Shorts link — finds the video ID, and shows you every available quality side by side so you can download exactly the size you need.',
          ],
        },
        {
          heading: 'What are thumbnail downloads used for?',
          paragraphs: [
            'Creators grab their own thumbnails for channel art, community posts, and A/B testing archives. Editors and journalists use them as video stills in articles and presentations. Designers study successful thumbnails for reference. Remember that thumbnails are the property of the video creator — download your own freely, and get permission before reusing someone else&apos;s work commercially.',
          ],
        },
        {
          heading: 'How to download a YouTube thumbnail',
          paragraphs: [
            'Paste the video link in the box above. Previews of every available resolution appear instantly — press Download on the one you want and the image saves as a JPG. If the HD (1280×720) version is missing, the video was uploaded without one; the next size down is always available.',
            'No software, no browser extension, and no YouTube login needed — and it works for Shorts too.',
          ],
        },
      ];

    case 'image-to-prompt': {
      const styleNote =
        tool.promptStyle === 'midjourney'
          ? 'This page is tuned for Midjourney: the generated prompt follows Midjourney conventions and appends --ar (aspect ratio, detected from your image) and --v parameters, ready to paste into Discord or the Midjourney web app.'
          : tool.promptStyle === 'stable-diffusion'
            ? 'This page is tuned for Stable Diffusion: you get a detailed, comma-separated positive prompt plus a matching negative prompt — ready for AUTOMATIC1111, ComfyUI, or any SD-based generator.'
            : 'You get all three formats side by side: Midjourney (with --ar and --v parameters), Stable Diffusion (with a negative prompt), and a rich plain-language description you can adapt for DALL·E, Flux, or any other model.';
      return [
        {
          heading: 'What does an image-to-prompt generator do?',
          paragraphs: [
            'It reverse-engineers a picture into words. Upload any image — a photo, an artwork, a 3D render, a product shot — and a vision-capable AI analyses the subject, composition, lighting, color palette, artistic style, and mood, then writes prompts designed to recreate that aesthetic in AI art generators.',
            styleNote,
          ],
        },
        {
          heading: 'How to get the best prompts',
          paragraphs: [
            'Use images with a clear subject and distinctive style — the more identifiable the aesthetic, the more useful the prompt. The generator describes style, not identity: it will characterise "a portrait in dramatic chiaroscuro lighting" without attempting to identify real people.',
            'Each prompt has a one-click copy button. Paste it into your generator of choice, then iterate: tweak adjectives, swap subjects, or merge phrases from the three variants.',
          ],
        },
        {
          heading: 'Limits and privacy',
          paragraphs: [
            'Prompt generation is the one tool on this site that uses a server, because it calls a vision AI model. Your image is sent over an encrypted connection, analysed, and never stored. To keep the tool free, generation is limited to 5 images per day per user — every other converter on this site is unlimited.',
          ],
        },
      ];
    }
  }
  // 'image-convert' is handled by the branch above; nothing reaches here
  throw new Error(`No content defined for tool kind: ${tool.kind}`);
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export function toolFaqs(tool: Tool): Faq[] {
  const common: Faq[] = [
    {
      question: 'Is this tool really free?',
      answer:
        'Yes — completely free, with no sign-up, no watermarks, and no daily limits. The site is supported by ads, and because conversions run in your browser rather than on our servers, there are no processing costs to pass on to you.',
    },
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. All conversion happens locally in your browser using the Canvas API and WebAssembly. Your files never leave your device, which makes this tool safe for private photos and confidential documents.',
    },
  ];

  if (tool.kind === 'image-convert' && tool.from && tool.to) {
    const f = FORMATS[tool.from];
    const t = FORMATS[tool.to];
    return [
      {
        question: `How do I convert ${f.name} to ${t.name}?`,
        answer: `Drag your ${f.name} files into the drop zone above (or click it to browse), ${
          t.lossy ? 'optionally adjust the quality slider, ' : ''
        }and press Convert. Each file is converted to ${t.name} in your browser within seconds, and you can download the results individually or as a ZIP.`,
      },
      ...common,
      {
        question: `Will converting ${f.name} to ${t.name} lose quality?`,
        answer: t.lossy
          ? `${t.name} uses lossy compression, so there is a quality/size tradeoff controlled by the quality slider. At 85–90% the difference is invisible for most images. ${
              f.lossy
                ? `Since ${f.name} is also lossy, avoid converting back and forth repeatedly.`
                : ''
            }`.trim()
          : `No — ${t.name} is a lossless format, so no new compression artifacts are introduced. The output preserves exactly the detail present in your ${f.name} file.`,
      },
      {
        question: `Can I convert multiple ${f.name} files at once?`,
        answer:
          'Yes. Drop as many files as you like — they are converted in a batch and you can download everything as a single ZIP archive.',
      },
      {
        question: f.transparency && !t.transparency
          ? `What happens to transparency when converting to ${t.name}?`
          : `Does ${t.name} work in all browsers and apps?`,
        answer: f.transparency && !t.transparency
          ? `${t.name} does not support transparency, so transparent regions are filled with white. If you need to keep transparency, convert to PNG, WebP or AVIF instead.`
          : `${t.name} is ${t.support}. ${t.drawbacks ? `Keep in mind: ${t.drawbacks}.` : ''}`.trim(),
      },
    ];
  }

  switch (tool.kind) {
    case 'image-compress':
      return [
        {
          question: 'How much can images be compressed?',
          answer:
            'Typical photos shrink by 60–90% depending on the source. A 4 MB phone photo usually compresses to 300–600 KB with no visible quality loss. PNGs with photographic content benefit the most — converting them to JPG or WebP while compressing can cut sizes by 10× or more.',
        },
        ...common,
        {
          question: 'Can I compress to an exact file size?',
          answer:
            'Yes — set a target size (like 200 KB) and the tool automatically searches for the best quality settings that fit under it, reducing dimensions as a last resort for very aggressive targets.',
        },
        {
          question: 'Which formats can I compress?',
          answer:
            'JPG, PNG, WebP, AVIF, BMP, GIF and HEIC input files are supported. Output is JPG or WebP for the best compression, or PNG when you need lossless output with transparency.',
        },
      ];
    case 'image-resize':
      return [
        {
          question: 'How do I resize an image to exact dimensions?',
          answer:
            'Choose pixel mode, enter the width and/or height you need, and press Resize. With the aspect-ratio lock enabled, entering one dimension calculates the other automatically so the image never looks stretched.',
        },
        ...common,
        {
          question: 'Can I resize multiple images at once?',
          answer:
            'Yes — batch resizing applies the same settings to every file you drop in, and you can download all results as a ZIP.',
        },
        {
          question: 'Will enlarging an image make it blurry?',
          answer:
            'Enlarging cannot add detail that was never captured, so upscaled images will look softer. Downscaling, on the other hand, keeps images crisp and is the most common use.',
        },
      ];
    case 'pdf-to-images':
      return [
        {
          question: 'How do I convert a PDF to JPG?',
          answer:
            'Drop your PDF into the box above, choose JPG (or PNG) and a quality level, and press Convert. Every page is rendered as an image you can download individually or as a ZIP.',
        },
        ...common,
        {
          question: 'What resolution are the output images?',
          answer:
            'Pages are rendered at roughly 2× their natural PDF size (about 150 DPI for a standard letter page), which keeps text sharp for screens and most print uses.',
        },
        {
          question: 'Should I choose JPG or PNG?',
          answer:
            'JPG produces much smaller files and is ideal for pages containing photos. PNG is lossless and keeps fine text and line art pixel-perfect, at the cost of larger files.',
        },
      ];
    case 'images-to-pdf':
      return [
        {
          question: 'How do I combine images into one PDF?',
          answer:
            'Drop your images above, drag them into the order you want, and press Create PDF. Each image becomes one page and the finished document downloads instantly.',
        },
        ...common,
        {
          question: 'Can I convert iPhone (HEIC) photos to PDF?',
          answer:
            'Yes — HEIC photos are decoded right in your browser and embedded into the PDF like any other image.',
        },
        {
          question: 'Does the PDF reduce my image quality?',
          answer:
            'No. JPG and PNG files are embedded losslessly without re-encoding, so the PDF contains your images at their exact original quality.',
        },
      ];
    case 'merge-pdf':
      return [
        {
          question: 'How do I merge PDF files?',
          answer:
            'Drop two or more PDFs above, drag them into the right order, and press Merge. The combined document downloads immediately.',
        },
        ...common,
        {
          question: 'Is there a limit on the number or size of PDFs?',
          answer:
            'No hard limits — because merging happens on your device, the only constraint is your computer’s memory. Documents with hundreds of pages merge in seconds.',
        },
        {
          question: 'Will the merged PDF lose quality?',
          answer:
            'No. Pages are copied losslessly into the new document — text stays selectable and images are not re-compressed.',
        },
      ];
    case 'split-pdf':
      return [
        {
          question: 'How do I extract pages from a PDF?',
          answer:
            'Drop your PDF above and type the pages you want, using ranges like "1-3, 7, 12-14". Press Split and a new PDF containing exactly those pages downloads instantly.',
        },
        ...common,
        {
          question: 'Can I split every page into its own file?',
          answer:
            'Yes — choose "Split every page" mode and each page becomes a separate single-page PDF, delivered together in a ZIP archive.',
        },
        {
          question: 'Does splitting change the quality?',
          answer:
            'No. Pages are copied losslessly, preserving text, fonts, and images exactly as they were in the original.',
        },
      ];
    case 'compress-pdf':
      return [
        {
          question: 'How much smaller will my PDF get?',
          answer:
            'Image-heavy PDFs (scans, photo reports, slide exports) typically shrink by 70–90%. PDFs that are mostly text are already small and compress less.',
        },
        ...common,
        {
          question: 'Why does the text look different after compressing?',
          answer:
            'Compression re-renders each page as an optimized image, so text becomes part of the page image and is no longer selectable. Visual quality is controlled by the quality preset you choose.',
        },
        {
          question: 'My PDF needs to be under 10 MB for an upload — can this do it?',
          answer:
            'Almost always, yes. Choose a stronger compression preset until the "after" size shown fits your limit. For extreme cases, split the document and compress the parts.',
        },
      ];
    case 'rotate-pdf':
      return [
        {
          question: 'How do I rotate pages in a PDF?',
          answer:
            'Drop your PDF above to see a thumbnail of every page. Click the rotate button on any page to turn it 90° per click, then press Apply to download the corrected PDF.',
        },
        ...common,
        {
          question: 'Can I delete pages at the same time?',
          answer:
            'Yes — toggle the delete button on any pages you want removed, and they are dropped from the output document when you press Apply.',
        },
        {
          question: 'Does rotating reduce quality?',
          answer:
            'No. Rotation is stored as lossless PDF page metadata — the page content itself is untouched, and text remains selectable.',
        },
      ];
    case 'bg-remove':
      return [
        {
          question: 'How do I remove the background from an image?',
          answer:
            'Drop your image into the box above. The AI analyses it on your device in a couple of seconds and shows a preview with the background removed — download it as a transparent PNG or a white-background JPG.',
        },
        ...common,
        {
          question: 'Is this really AI? How does it work offline?',
          answer:
            'Yes — it runs U²-Net, a neural network for salient-object segmentation, compiled to WebAssembly. The ~4.5 MB model downloads once, is cached by your browser, and then works even with a poor connection.',
        },
        {
          question: 'What images work best?',
          answer:
            'Photos with a clear subject: people, products, pets, cars, food. Very cluttered scenes and fine details like flyaway hair are genuinely hard for on-device models — inspect the preview, and for tricky edges consider a touch-up in an editor.',
        },
        {
          question: 'What resolution is the output?',
          answer:
            'The same resolution as your original — the AI computes the cutout mask and applies it to your full-size image, so nothing is downscaled.',
        },
      ];

    case 'pdf-to-word':
      return [
        {
          question: 'How do I convert a PDF to Word?',
          answer:
            'Drop your PDF into the box above and press Convert. The text is extracted in your browser and downloads as a .docx file you can edit in Word, Google Docs, or LibreOffice.',
        },
        ...common,
        {
          question: 'Does it keep the original layout?',
          answer:
            'The text is preserved page by page, but complex layouts (multi-column pages, embedded images, intricate tables) are simplified into flowing paragraphs. It is built for editing and reusing the text, not for pixel-perfect reproduction.',
        },
        {
          question: 'Does it work on scanned PDFs?',
          answer:
            'No — scanned documents are photographs of paper with no text layer, so they need OCR (optical character recognition), which this tool does not perform. It works on any PDF where you can select the text in a viewer.',
        },
      ];
    case 'docx-to-html':
      return [
        {
          question: 'How do I convert a Word document to HTML?',
          answer:
            'Drop a .docx file above. You instantly get a preview, the clean HTML with a copy button, and a downloadable .html file. From Google Docs, first use File → Download → Microsoft Word (.docx).',
        },
        ...common,
        {
          question: 'Why not just paste from Word into my CMS?',
          answer:
            'Pasting from Word carries over hundreds of proprietary inline styles that bloat your page and fight your site’s design. This tool produces semantic tags only — h2, p, strong, em, ul, a — which is what CMSs and search engines actually want.',
        },
        {
          question: 'Are images in the document included?',
          answer:
            'Yes — images embedded in the .docx are converted to inline data URIs so the HTML is self-contained. For production sites, consider uploading the images to your CMS and swapping the sources, since inline images make the HTML file large.',
        },
      ];
    case 'video-to-mp3':
      return [
        {
          question: 'How do I convert MP4 to MP3?',
          answer:
            'Drop your video into the box above and press Extract audio. The MP3 is created in your browser and downloads when done. MP4, WebM, MOV, MKV and AVI inputs are supported.',
        },
        ...common,
        {
          question: 'Why does the first conversion take a moment to start?',
          answer:
            'The conversion engine (ffmpeg compiled to WebAssembly, ~31 MB) downloads on first use and is cached by your browser afterwards. This is what makes fully private, in-browser conversion possible.',
        },
        {
          question: 'What audio quality do I get?',
          answer:
            'A high-quality variable-bitrate MP3 (~190 kbps) — transparent for speech and podcasts, very good for music. The output can never exceed the quality of the audio inside your video.',
        },
      ];
    case 'video-to-gif':
      return [
        {
          question: 'How do I turn a video into a GIF?',
          answer:
            'Drop your video above, choose the start time, duration, width and frame rate, then press Convert. The GIF is generated in your browser with an optimized color palette and downloads immediately.',
        },
        ...common,
        {
          question: 'Why is my GIF so large?',
          answer:
            'GIF is a 30-year-old format that stores every frame as an indexed image — it is inherently inefficient. Keep clips short (under ~10 s), use 320–480 px width and 10–15 fps for chat-friendly sizes.',
        },
        {
          question: 'What does the frame rate setting do?',
          answer:
            'It controls how many frames per second the GIF keeps. 10–15 fps looks smooth for most content at half the size of 25 fps; 5 fps suits slideshows and screen recordings.',
        },
      ];
    case 'video-compress':
      return [
        {
          question: 'How do I compress a video for WhatsApp or email?',
          answer:
            'Drop the video above, choose Balanced (or Strong for the smallest file), and press Compress. Typical phone videos shrink by 60–90%, comfortably under WhatsApp’s 64 MB and email’s 25 MB caps.',
        },
        ...common,
        {
          question: 'How long does compression take?',
          answer:
            'Re-encoding runs at roughly real-time speed on a typical laptop — a 2-minute clip takes about 2 minutes. It is CPU work happening on your device, which is the price of complete privacy. For long videos, trim to the needed section first.',
        },
        {
          question: 'Will the quality drop?',
          answer:
            'Light and Balanced presets are visually near-identical to the original for phone and social viewing. Strong trades visible sharpness for the smallest possible file. Keep your original — compression is one-way.',
        },
      ];
    case 'video-trim':
      return [
        {
          question: 'How do I cut a section from a video?',
          answer:
            'Drop the video above, enter the start and end times (seconds or mm:ss), and press Trim. The cut section downloads as an MP4 almost instantly.',
        },
        ...common,
        {
          question: 'Does trimming reduce quality?',
          answer:
            'No — the video is cut without re-encoding (stream copy), so the output is byte-for-byte the same quality as the original, and even hour-long files trim in seconds.',
        },
        {
          question: 'Why doesn’t the clip start exactly where I asked?',
          answer:
            'Lossless cutting must start at a keyframe, so the start can land up to a couple of seconds early (never late). Trim slightly wide, or re-encode with the video compressor for frame-exact boundaries.',
        },
      ];
    case 'youtube-thumbnail':
      return [
        {
          question: 'How do I download a YouTube thumbnail?',
          answer:
            'Paste any YouTube link (youtube.com/watch, youtu.be, or Shorts) into the box above. All available thumbnail resolutions appear as previews — click Download under the one you want.',
        },
        {
          question: 'What resolutions are available?',
          answer:
            'Up to five: 1280×720 (HD, most modern videos), 640×480, 480×360 (always available), 320×180, and 120×90. If the HD version is missing, the video simply was not uploaded with one.',
        },
        {
          question: 'Is this free? Do I need to log in?',
          answer:
            'Completely free, no login, no software. The thumbnail is fetched directly from YouTube’s public image servers and saved as a JPG.',
        },
        {
          question: 'Does it work for YouTube Shorts?',
          answer:
            'Yes — paste the Shorts link and the thumbnail is found the same way. Live streams and regular videos work too.',
        },
        {
          question: 'Can I use downloaded thumbnails anywhere?',
          answer:
            'Thumbnails belong to the video’s creator. Downloading your own is always fine; for anyone else’s, get permission before commercial reuse — quoting for commentary, news, or research is generally accepted practice.',
        },
      ];
    case 'image-to-prompt':
      return [
        {
          question: 'How does the image-to-prompt generator work?',
          answer:
            'Your image is analysed by a vision-capable AI model (Claude) that describes the subject, composition, lighting, palette, and artistic style, then formats that analysis as ready-to-use prompts for Midjourney, Stable Diffusion, and generic AI art tools.',
        },
        {
          question: 'Is it free?',
          answer:
            'Yes — you get 5 free prompt generations per day. The daily cap exists because, unlike our converters, this tool calls a paid AI API. Every other tool on the site is unlimited.',
        },
        {
          question: 'Is my image stored anywhere?',
          answer:
            'No. The image is sent over an encrypted connection for analysis and is not saved. Prompt text is generated and returned to your browser immediately.',
        },
        {
          question: 'Which AI art tools do the prompts work with?',
          answer:
            'The Midjourney variant includes --ar and --v parameters for Midjourney v6+. The Stable Diffusion variant includes a negative prompt for SD/SDXL interfaces like AUTOMATIC1111 and ComfyUI. The generic description works with DALL·E, Flux, Ideogram, and virtually any text-to-image model.',
        },
        {
          question: 'Why did I get a rate-limit message?',
          answer:
            'Each user gets 5 generations per rolling day to keep the tool free for everyone. The counter resets 24 hours after your first generation of the day.',
        },
      ];
  }
  throw new Error(`No FAQs defined for tool kind: ${tool.kind}`);
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

export function toolJsonLd(tool: Tool) {
  const url = `${SITE_URL}/${tool.slug}`;
  const faqs = toolFaqs(tool);

  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.h1,
    url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return [softwareApplication, faqPage];
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Free online file converters — images, PDFs and AI prompt tools that run entirely in your browser.',
  };
}
