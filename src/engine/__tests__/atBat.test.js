import { describe, it, expect } from 'vitest';
import { resolveAtBat } from '../atBat.js';
import { batterRates, pitcherRates } from '../statConversion.js';
import { LEAGUE_AVERAGE } from '../constants.js';
import { mulberry32 } from '../rng.js';
import { braves2021 } from '../../data/teams/braves2021.js';
import { astros2021 } from '../../data/teams/astros2021.js';

function simulateN(batterRatesObj, pitcherRatesObj, n, seed) {
  const rng = mulberry32(seed);
  const counts = { BB: 0, HBP: 0, SO: 0, HR: 0, SINGLE: 0, DOUBLE: 0, TRIPLE: 0, OUT: 0 };
  for (let i = 0; i < n; i++) {
    const outcome = resolveAtBat(batterRatesObj, pitcherRatesObj, rng);
    counts[outcome.type] += 1;
  }
  return counts;
}

describe('resolveAtBat statistical validation', () => {
  it('a .300 hitter facing a league-average pitcher bats close to .300 over a large sample', () => {
    const freeman = braves2021.lineup.find((p) => p.name === 'Freddie Freeman').batting;
    const rates = batterRates(freeman);

    const n = 20000;
    const counts = simulateN(rates, LEAGUE_AVERAGE, n, 12345);

    const hits = counts.SINGLE + counts.DOUBLE + counts.TRIPLE + counts.HR;
    const ab = n - counts.BB - counts.HBP;
    const avg = hits / ab;

    expect(avg).toBeGreaterThan(freeman.avg - 0.03);
    expect(avg).toBeLessThan(freeman.avg + 0.03);
  });

  it('a low-average hitter (Maldonado, .172) bats close to his own average', () => {
    const maldonado = astros2021.lineup.find((p) => p.name === 'Martín Maldonado').batting;
    const rates = batterRates(maldonado);

    const n = 20000;
    const counts = simulateN(rates, LEAGUE_AVERAGE, n, 999);

    const hits = counts.SINGLE + counts.DOUBLE + counts.TRIPLE + counts.HR;
    const ab = n - counts.BB - counts.HBP;
    const avg = hits / ab;

    expect(avg).toBeGreaterThan(maldonado.avg - 0.03);
    expect(avg).toBeLessThan(maldonado.avg + 0.03);
  });

  it('a dominant strikeout pitcher (McCullers) elevates strikeout rate above a league-average hitter baseline', () => {
    const leagueAverageBatter = {
      bb: LEAGUE_AVERAGE.bb,
      hbp: LEAGUE_AVERAGE.hbp,
      so: LEAGUE_AVERAGE.so,
      hr: LEAGUE_AVERAGE.hr,
      hit: LEAGUE_AVERAGE.hit,
      single: 0.12,
      double: 0.04,
      triple: 0.003,
    };
    const mccullers = pitcherRates(astros2021.pitchers.starter.pitching);

    const n = 20000;
    const counts = simulateN(leagueAverageBatter, mccullers, n, 42);
    const kRate = counts.SO / n;

    expect(kRate).toBeGreaterThan(LEAGUE_AVERAGE.so);
  });

  it('is deterministic given the same seed', () => {
    const rates = batterRates(braves2021.lineup[1].batting);
    const a = simulateN(rates, LEAGUE_AVERAGE, 500, 7);
    const b = simulateN(rates, LEAGUE_AVERAGE, 500, 7);
    expect(a).toEqual(b);
  });
});
