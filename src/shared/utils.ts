export function isValidNumber(value: string): boolean {
  const reg = /\D/g;
  return !reg.test(value);
}

export function datesHoursDiff(startDate: Date, endDate: Date): number {
  const dateDiff = endDate.getTime() - startDate.getTime();
  return Math.floor((dateDiff % 86400000) / 3600000);
}
