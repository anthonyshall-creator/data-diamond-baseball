import { describe, it, expect } from 'vitest';
import { batterRates, pitcherRates } from '../statConversion.js';
import { braves2021 } from '../../data/teams/braves2021.js';
import { astros2021 } from '../../data/teams/astros2021.js';

describe('batterRates', () => {
  it('derives per-PA rates that reconstruct the original counting stats', () => {
    const freeman = braves2021.lineup.find((p) => p.name === 'Freddie Freeman').batting;
    const rates = batterRates(freeman);

    expect(rates.bb * freeman.pa).toBeCloseTo(freeman.bb, 6);
    expect(rates.so * freeman.pa).toBeCloseTo(freeman.so, 6);
    expect(rates.hr * freeman.pa).toBeCloseTo(freeman.hr, 6);
    expect((rates.single + rates.double + rates.triple + rates.hr) * freeman.pa).toBeCloseTo(freeman.h, 6);
  });

  it('produces rates that sum to less than 1', () => {
    for (const player of [...braves2021.lineup, ...astros2021.lineup]) {
      const rates = batterRates(player.batting);
      const sum = rates.bb + rates.hbp + rates.so + rates.hr + rates.single + rates.double + rates.triple;
      expect(sum).toBeLessThan(1);
      expect(sum).toBeGreaterThan(0);
    }
  });
});

describe('pitcherRates', () => {
  it('derives per-batters-faced rates that reconstruct the original counting stats', () => {
    const morton = braves2021.pitchers.starter.pitching;
    const rates = pitcherRates(morton);

    expect(rates.bb * morton.bf).toBeCloseTo(morton.bb, 6);
    expect(rates.so * morton.bf).toBeCloseTo(morton.so, 6);
    expect(rates.hr * morton.bf).toBeCloseTo(morton.hr, 6);
  });
});
