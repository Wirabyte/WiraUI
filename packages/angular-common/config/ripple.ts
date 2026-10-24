/** Ink effect for pressed controls. Styles: `.wt-ripple-ink` in the component CSS. */
export function ɵrippleAt(target: HTMLElement, event: PointerEvent): void {
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ink = target.ownerDocument.createElement('span');
  ink.className = 'wt-ripple-ink';
  ink.style.width = ink.style.height = size + 'px';
  ink.style.left = event.clientX - rect.left - size / 2 + 'px';
  ink.style.top = event.clientY - rect.top - size / 2 + 'px';
  target.appendChild(ink);
  setTimeout(() => ink.remove(), 600);
}
