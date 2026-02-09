/**
 * Format generations used/limit for display (e.g. "3 / 5" or "10 (Unlimited)").
 */
export function formatGenerationsDisplay(
  used: number,
  limit: number | null
): string {
  if (limit === null) {
    return `${used} (Unlimited)`;
  }
  return `${used} / ${limit}`;
}

/**
 * Check if user is at their monthly generation limit (for disabling buttons).
 */
export function isAtMonthlyLimit(
  used: number,
  limit: number | null,
  bypassSubscription?: boolean
): boolean {
  if (bypassSubscription) return false;
  if (limit === null) return false; // unlimited
  return used >= limit;
}
