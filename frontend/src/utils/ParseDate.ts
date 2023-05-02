export function parseDate(date: Date | undefined) {
  return date?.toISOString().replace("T", " ").substring(0, 19);
}
