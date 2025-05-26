/**
 * Gets the total scrollable height of the document
 * accounting for viewport height
 */
export function getTotalScrollableHeight(): number {
  if (typeof window === 'undefined') return 0;
  const windowHeight = window.innerHeight;
  const docEl = document.documentElement;
  return docEl.scrollHeight - windowHeight;
}

/**
 * Gets the current scroll percentage (0-100)
 */
export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0;
  const scrollTop = window.scrollY;
  const totalScrollable = Math.max(getTotalScrollableHeight(), 1);
  return Math.min((scrollTop / totalScrollable) * 100, 100);
}
