'use client';

import { useEffect, useRef } from 'react';
import { shirtRailMarkup } from './markup.mjs';
import './shirt-rail.css';

// Rendered on the server too, so the static shirts show before JavaScript runs.
const markup = shirtRailMarkup();

type Props = {
  /** Public URL of the folder holding textures/ (default: /shirt-rail/). */
  assetBase?: string;
  className?: string;
};

export default function ShirtRailHero({ assetBase = '/shirt-rail/', className }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroy: (() => void) | undefined;
    let cancelled = false;
    // Three.js and the rack code load only in the browser, after hydration.
    import('./app.js').then(({ mountShirtRail }) => {
      const root = host.current?.querySelector<HTMLElement>('.shirt-rail');
      if (cancelled || !root) return;
      destroy = mountShirtRail(root, { assetBase });
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [assetBase]);

  return (
    <div
      ref={host}
      className={className}
      style={{ height: '100%' }}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
