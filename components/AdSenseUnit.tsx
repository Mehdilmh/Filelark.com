'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Renders a real AdSense ad unit and requests a fill once mounted. */
export default function AdSenseUnit({
  client,
  slot,
}: {
  client: string;
  slot: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked by an ad blocker — the reserved space simply stays empty */
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', height: '100%' }}
      data-ad-client={client}
      data-ad-slot={slot}
    />
  );
}
