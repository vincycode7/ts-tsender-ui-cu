export function calculateTotal(input: string): number {
  if (!input) return 0;

  return input
    .split(/[\n,]+/) // split on newline or comma
    .map((value) => value.trim()) // remove whitespace
    .filter((value) => value !== '') // ignore empty strings
    .map((amt) => parseFloat(amt)) // convert to number
    .reduce((acc, num) => acc + (isNaN(num) ? 0 : num), 0); // sum, ignore NaN
}
