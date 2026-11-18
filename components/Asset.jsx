'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Image slot. src null → labeled placeholder (no loader).
 * src set → paper-toned skeleton until the image loads.
 */
export default function Asset({ src, alt, label, ratio, className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const img = useRef(null);
  // The image can finish loading before hydration, when onLoad has no listener yet.
  useEffect(() => { if (img.current?.complete) setLoaded(true); }, [src]);
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (!src) {
    return (
      <div className={`asset asset--placeholder ${className}`} style={style} role="img" aria-label={`Placeholder: ${label}`}>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div className={`asset${loaded ? '' : ' asset--loading'} ${className}`} style={style}>
      <img ref={img} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoaded(true)} />
    </div>
  );
}
