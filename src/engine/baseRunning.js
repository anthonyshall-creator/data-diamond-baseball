import { DOUBLE_PLAY_CHANCE, TAG_UP_SCORE_CHANCE } from './constants.js';

const EMPTY_BASES = Object.freeze({ first: null, second: null, third: null });

export function emptyBases() {
  return { ...EMPTY_BASES };
}

// Applies an at-bat outcome to the current base/out state. Returns the new
// base state, outs recorded on the play, which runners scored (in order, for
// R/RBI box-score credit), and whether the batter is credited with RBI.
export function advanceRunners(bases, outsBefore, outcome, batter, rng) {
  switch (outcome.type) {
    case 'BB':
      return forceAdvance(bases, batter, 'walks');
    case 'HBP':
      return forceAdvance(bases, batter, 'is hit by the pitch');
    case 'HR':
      return homeRun(bases, batter);
    case 'SINGLE':
      return single(bases, batter, rng);
    case 'DOUBLE':
      return double(bases, batter, rng);
    case 'TRIPLE':
      return triple(bases, batter);
    case 'SO':
      return { bases, outsRecorded: 1, runsScored: [], rbiEligible: false, log: `${batter.name} strikes out.` };
    case 'OUT':
      return handleOut(bases, outsBefore, outcome, batter, rng);
    default:
      throw new Error(`Unknown outcome type: ${outcome.type}`);
  }
}

function forceAdvance(bases, batter, verb) {
  const { first, second, third } = bases;
  const runsScored = [];
  let newBases;

  if (!first) {
    newBases = { first: batter, second, third };
  } else if (!second) {
    newBases = { first: batter, second: first, third };
  } else if (!third) {
    newBases = { first: batter, second: first, third: second };
  } else {
    runsScored.push(third);
    newBases = { first: batter, second: first, third: second };
  }

  return {
    bases: newBases,
    outsRecorded: 0,
    runsScored,
    rbiEligible: true,
    log: `${batter.name} ${verb}${runsScored.length ? ', forcing in a run' : ''}.`,
  };
}

function homeRun(bases, batter) {
  const runsScored = [bases.first, bases.second, bases.third, batter].filter(Boolean);
  return {
    bases: emptyBases(),
    outsRecorded: 0,
    runsScored,
    rbiEligible: true,
    log: `${batter.name} homers${runsScored.length > 1 ? ` (${runsScored.length}-run HR)` : ''}!`,
  };
}

function single(bases, batter, rng) {
  const runsScored = [];
  const newBases = emptyBases();
  if (bases.third) runsScored.push(bases.third);

  if (bases.second) {
    if (rng() < 0.6) runsScored.push(bases.second);
    else newBases.third = bases.second;
  }

  if (bases.first) {
    if (rng() < 0.15) newBases.third = newBases.third ?? bases.first;
    else newBases.second = bases.first;
  }

  newBases.first = batter;
  return {
    bases: newBases,
    outsRecorded: 0,
    runsScored,
    rbiEligible: true,
    log: `${batter.name} singles${runsScored.length ? `, ${runsScored.length} run(s) score` : ''}.`,
  };
}

function double(bases, batter, rng) {
  const runsScored = [];
  const newBases = emptyBases();
  if (bases.third) runsScored.push(bases.third);
  if (bases.second) runsScored.push(bases.second);

  if (bases.first) {
    if (rng() < 0.45) runsScored.push(bases.first);
    else newBases.third = bases.first;
  }

  newBases.second = batter;
  return {
    bases: newBases,
    outsRecorded: 0,
    runsScored,
    rbiEligible: true,
    log: `${batter.name} doubles${runsScored.length ? `, ${runsScored.length} run(s) score` : ''}.`,
  };
}

function triple(bases, batter) {
  const runsScored = [bases.first, bases.second, bases.third].filter(Boolean);
  return {
    bases: { first: null, second: null, third: batter },
    outsRecorded: 0,
    runsScored,
    rbiEligible: true,
    log: `${batter.name} triples${runsScored.length ? `, ${runsScored.length} run(s) score` : ''}!`,
  };
}

function handleOut(bases, outsBefore, outcome, batter, rng) {
  if (outcome.outType === 'groundout') return groundout(bases, outsBefore, batter, rng);
  if (outcome.outType === 'flyout') return flyout(bases, outsBefore, batter, rng);
  return { bases, outsRecorded: 1, runsScored: [], rbiEligible: false, log: `${batter.name} lines out.` };
}

function groundout(bases, outsBefore, batter, rng) {
  const forceAtSecond = Boolean(bases.first);
  if (forceAtSecond && outsBefore < 2 && rng() < DOUBLE_PLAY_CHANCE) {
    const newBases = { first: null, second: null, third: bases.third };
    return {
      bases: newBases,
      outsRecorded: 2,
      runsScored: [],
      rbiEligible: false,
      log: `${batter.name} grounds into a double play.`,
    };
  }

  const { first, second, third } = bases;
  const runsScored = [];
  const newBases = { first: null, second, third };

  if (first) {
    // Force chain: batter out at first, every occupied base ahead is forced.
    newBases.second = first;
    if (second) {
      newBases.third = second;
      if (third) runsScored.push(third);
    }
  } else if (third && outsBefore < 2 && rng() < 0.5) {
    // No force in play — runner on third alone scores on some groundouts.
    runsScored.push(third);
    newBases.third = null;
  }

  return {
    bases: newBases,
    outsRecorded: 1,
    runsScored,
    rbiEligible: runsScored.length > 0,
    log: `${batter.name} grounds out${runsScored.length ? ', run scores' : ''}.`,
  };
}

function flyout(bases, outsBefore, batter, rng) {
  const runsScored = [];
  let newBases = { ...bases };
  if (bases.third && outsBefore < 2 && rng() < TAG_UP_SCORE_CHANCE) {
    runsScored.push(bases.third);
    newBases = { ...newBases, third: null };
  }
  return {
    bases: newBases,
    outsRecorded: 1,
    runsScored,
    rbiEligible: runsScored.length > 0,
    log: `${batter.name} flies out${runsScored.length ? ', sacrifice fly scores a run' : ''}.`,
  };
}
