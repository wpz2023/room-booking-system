export function parseDate(date: Date | undefined) {
  date?.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date?.toISOString().replace("T", " ").substring(0, 19);
}
