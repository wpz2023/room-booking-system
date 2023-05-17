export function parseDateFromUTC(date: Date | undefined) {
  date?.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date?.toISOString().replace("T", " ").substring(0, 19);
}

export function parseStringToUTC(dateString: string | undefined) {
  const date = new Date(dateString as string);
  return date;
}

export function parseDateFromDB(dateString: string | undefined) {
  const date = new Date(dateString as string);
  return date;
}
