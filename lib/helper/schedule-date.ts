/** "2026-10-12" (an IST calendar day) -> "12 Oct" or "12 Oct 2026". */
export function formatScheduleDate(date: string | null | undefined, withYear = false) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
