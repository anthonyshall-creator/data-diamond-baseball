import { describe, it, expect } from 'vitest';
import { emptyBases, advanceRunners } from '../baseRunning.js';

const batter = { id: 'batter', name: 'Batter' };
const r1 = { id: 'r1', name: 'Runner1' };
const r2 = { id: 'r2', name: 'Runner2' };
const r3 = { id: 'r3', name: 'Runner3' };

const alwaysLow = () => 0.01; // forces "advance further" branches
const alwaysHigh = () => 0.99; // forces "hold" branches

describe('advanceRunners', () => {
  it('bases loaded walk forces in a run and shifts everyone up one base', () => {
    const bases = { first: r1, second: r2, third: r3 };
    const result = advanceRunners(bases, 0, { type: 'BB' }, batter, alwaysLow);

    expect(result.bases).toEqual({ first: batter, second: r1, third: r2 });
    expect(result.runsScored).toEqual([r3]);
    expect(result.outsRecorded).toBe(0);
  });

  it('empty-base walk just puts the batter on first', () => {
    const result = advanceRunners(emptyBases(), 0, { type: 'BB' }, batter, alwaysLow);
    expect(result.bases).toEqual({ first: batter, second: null, third: null });
    expect(result.runsScored).toEqual([]);
  });

  it('grand slam clears the bases and scores 4', () => {
    const bases = { first: r1, second: r2, third: r3 };
    const result = advanceRunners(bases, 0, { type: 'HR' }, batter, alwaysLow);

    expect(result.bases).toEqual(emptyBases());
    expect(result.runsScored).toHaveLength(4);
    expect(result.runsScored).toEqual(expect.arrayContaining([r1, r2, r3, batter]));
  });

  it('solo home run with empty bases scores just the batter', () => {
    const result = advanceRunners(emptyBases(), 0, { type: 'HR' }, batter, alwaysLow);
    expect(result.runsScored).toEqual([batter]);
  });

  it('strikeout records one out and leaves runners in place', () => {
    const bases = { first: r1, second: null, third: null };
    const result = advanceRunners(bases, 1, { type: 'SO' }, batter, alwaysLow);
    expect(result.outsRecorded).toBe(1);
    expect(result.bases).toEqual(bases);
    expect(result.runsScored).toEqual([]);
  });

  it('groundout with a runner on first and no double play forces the runner to second', () => {
    const bases = { first: r1, second: null, third: null };
    const result = advanceRunners(bases, 0, { type: 'OUT', outType: 'groundout' }, batter, alwaysHigh);
    expect(result.outsRecorded).toBe(1);
    expect(result.bases).toEqual({ first: null, second: r1, third: null });
  });

  it('groundout can turn a double play with a runner on first and fewer than 2 outs', () => {
    const bases = { first: r1, second: null, third: null };
    const result = advanceRunners(bases, 0, { type: 'OUT', outType: 'groundout' }, batter, alwaysLow);
    expect(result.outsRecorded).toBe(2);
    expect(result.bases).toEqual({ first: null, second: null, third: null });
  });

  it('never turns a double play with 2 outs already recorded', () => {
    const bases = { first: r1, second: null, third: null };
    const result = advanceRunners(bases, 2, { type: 'OUT', outType: 'groundout' }, batter, alwaysLow);
    expect(result.outsRecorded).toBe(1);
    expect(result.bases).toEqual({ first: null, second: r1, third: null });
  });

  it('sacrifice fly scores the runner from third with fewer than 2 outs', () => {
    const bases = { first: null, second: null, third: r3 };
    const result = advanceRunners(bases, 1, { type: 'OUT', outType: 'flyout' }, batter, alwaysLow);
    expect(result.runsScored).toEqual([r3]);
    expect(result.bases.third).toBeNull();
    expect(result.outsRecorded).toBe(1);
  });

  it('flyout with 2 outs cannot be a sacrifice fly (inning over)', () => {
    const bases = { first: null, second: null, third: r3 };
    const result = advanceRunners(bases, 2, { type: 'OUT', outType: 'flyout' }, batter, alwaysLow);
    expect(result.runsScored).toEqual([]);
    expect(result.bases.third).toBe(r3);
  });

  it('triple with runners on clears the bases except the batter on third', () => {
    const bases = { first: r1, second: r2, third: null };
    const result = advanceRunners(bases, 0, { type: 'TRIPLE' }, batter, alwaysLow);
    expect(result.bases).toEqual({ first: null, second: null, third: batter });
    expect(result.runsScored).toEqual(expect.arrayContaining([r1, r2]));
  });
});
