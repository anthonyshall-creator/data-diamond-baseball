import { log5 } from './log5.js';
import { LEAGUE_AVERAGE, BATTED_BALL_SPLIT } from './constants.js';

const MATCHUP_CATEGORIES = ['bb', 'hbp', 'so', 'hr', 'hit'];

// Combines a batter's and pitcher's per-PA rates (already fatigue-adjusted by
// the caller for the pitcher side) into a matchup probability distribution
// over: bb, hbp, so, hr, hit, out. Rolls one random number to pick the bucket,
// then a second roll to resolve hit-type or batted-ball-type as needed.
export function resolveAtBat(batterRates, pitcherRates, rng) {
  const blended = {};
  let sum = 0;
  for (const cat of MATCHUP_CATEGORIES) {
    blended[cat] = log5(batterRates[cat], pitcherRates[cat], LEAGUE_AVERAGE[cat]);
    sum += blended[cat];
  }
  // Floor keeps a plausible out rate even if the blended hit/BB/K rates alone
  // would already exceed 1 (extreme matchups); everything is renormalized below.
  blended.out = Math.max(0.05, 1 - sum);
  const total = sum + blended.out;

  const roll = rng();
  let acc = 0;
  let bucket = 'out';
  for (const cat of [...MATCHUP_CATEGORIES, 'out']) {
    acc += blended[cat] / total;
    if (roll < acc) {
      bucket = cat;
      break;
    }
  }

  switch (bucket) {
    case 'bb':
      return { type: 'BB', description: 'walks' };
    case 'hbp':
      return { type: 'HBP', description: 'hit by pitch' };
    case 'so':
      return { type: 'SO', description: 'strikes out' };
    case 'hr':
      return { type: 'HR', description: 'homers' };
    case 'hit':
      return resolveHitType(batterRates, rng);
    default:
      return resolveOutType(rng);
  }
}

function resolveHitType(batterRates, rng) {
  const { single, double, triple } = batterRates;
  const total = single + double + triple;
  if (total <= 0) return { type: 'SINGLE', description: 'singles' };

  const roll = rng() * total;
  if (roll < single) return { type: 'SINGLE', description: 'singles' };
  if (roll < single + double) return { type: 'DOUBLE', description: 'doubles' };
  return { type: 'TRIPLE', description: 'triples' };
}

function resolveOutType(rng) {
  const { groundout, flyout } = BATTED_BALL_SPLIT;
  const roll = rng();
  if (roll < groundout) return { type: 'OUT', outType: 'groundout', description: 'grounds out' };
  if (roll < groundout + flyout) return { type: 'OUT', outType: 'flyout', description: 'flies out' };
  return { type: 'OUT', outType: 'lineout', description: 'lines out' };
}
