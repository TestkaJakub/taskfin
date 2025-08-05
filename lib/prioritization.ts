export function computePriority(
  importance: number,
  enjoyment: number,
  practicalValue: number,
  dueISO: string | null,
  x = 1
): number {
  if (!dueISO) {
    return (importance + enjoyment + practicalValue) / 3;
  }

  const now = new Date();
  const due = new Date(dueISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDue = Math.max(0, (due.getTime() - now.getTime()) / msPerDay);

  const d = Math.min(10, daysUntilDue);

  return (
    ( (10 - d) * (1 + x) +
      importance +
      enjoyment +
      practicalValue ) /
    (4 + x)
  );
}