import { describe, it, expect } from 'vitest';
import { log5 } from '../log5.js';

describe('log5', () => {
  it('returns the batter rate unchanged when the pitcher rate equals league average', () => {
    const result = log5(0.3, 0.25, 0.25);
    expect(result).toBeCloseTo(0.3, 10);
  });

  it('returns the pitcher rate unchanged when the batter rate equals league average', () => {
    const result = log5(0.25, 0.35, 0.25);
    expect(result).toBeCloseTo(0.35, 10);
  });

  it('pulls the result above league average when both batter and pitcher favor the event', () => {
    const result = log5(0.35, 0.35, 0.25);
    expect(result).toBeGreaterThan(0.35);
  });

  it('pulls the result below league average when both batter and pitcher suppress the event', () => {
    const result = log5(0.15, 0.15, 0.25);
    expect(result).toBeLessThan(0.15);
  });

  it('stays within (0, 1)', () => {
    const result = log5(0.9, 0.9, 0.1);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });
});
