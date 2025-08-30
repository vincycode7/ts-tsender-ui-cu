// calculateTotal.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('returns 0 for empty string', () => {
    expect(calculateTotal('')).toBe(0);
  });

  it('sums comma-separated numbers', () => {
    expect(calculateTotal('100,200,300')).toBe(600);
  });

  it('sums newline-separated numbers', () => {
    expect(calculateTotal('100\n200\n300')).toBe(600);
  });

  it('handles mixed newline and comma separation', () => {
    expect(calculateTotal('100,\n200,\n300')).toBe(600);
  });

  it('ignores non-numeric values', () => {
    expect(calculateTotal('100,abc,200')).toBe(300);
  });

  it('ignores extra spaces', () => {
    expect(calculateTotal(' 100 , 200 , 300 ')).toBe(600);
  });

  it('ignores empty lines or separators', () => {
    expect(calculateTotal('100,\n,\n200,,300')).toBe(600);
  });

  it('handles decimals', () => {
    expect(calculateTotal('100.5, 200.25')).toBeCloseTo(300.75);
  });

  it('includes 0 in total', () => {
    expect(calculateTotal('0,100,0')).toBe(100);
  });
});
