let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/**
 * Stops the page scrolling behind a modal and keeps the layout from shifting where the scrollbar was.
 * Counted, so stacked modals unlock only when the last one closes. Returns the unlock function.
 */
export function ɵlockScroll(doc: Document): () => void {
  const root = doc.documentElement;
  const body = doc.body;
  if (locks++ === 0) {
    const bar = (doc.defaultView?.innerWidth ?? 0) - root.clientWidth;
    saved = { overflow: root.style.overflow, paddingRight: body.style.paddingRight };
    root.style.overflow = 'hidden';
    if (bar > 0) body.style.paddingRight = `calc(${doc.defaultView!.getComputedStyle(body).paddingRight} + ${bar}px)`;
    root.classList.add('wt-overflow-hidden');
  }
  let done = false;
  return () => {
    if (done) return;
    done = true;
    if (--locks === 0 && saved) {
      root.style.overflow = saved.overflow;
      body.style.paddingRight = saved.paddingRight;
      root.classList.remove('wt-overflow-hidden');
      saved = null;
    }
  };
}
