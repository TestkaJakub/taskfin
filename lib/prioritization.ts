// lib/prioritization.ts

/**
 * Compute task priority.
 *
 * @param importance 0–10
 * @param enjoyment 0–10
 * @param practicalValue 0–10
 * @param dueISO     ISO due-date string or null
 * @param x          weight for due-date term (e.g. 1)
 * @returns priority score
 */
export function computePriority(
  importance: number,
  enjoyment: number,
  practicalValue: number,
  dueISO: string | null,
  x = 1
): number {
  // no due date → average of the three values
  if (!dueISO) {
    return (importance + enjoyment + practicalValue) / 3;
  }

  // days until due (float)
  const now = new Date();
  const due = new Date(dueISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDue = Math.max(0, (due.getTime() - now.getTime()) / msPerDay);

  // clamp to 10
  const d = Math.min(10, daysUntilDue);

  // formula: ((10 – d) * (1 + x) + importance + enjoyment + practicalValue) / (4 + x)
  return (
    ( (10 - d) * (1 + x) +
      importance +
      enjoyment +
      practicalValue ) /
    (4 + x)
  );
}