import { emptyBases, advanceRunners } from './baseRunning.js';
import { resolveAtBat } from './atBat.js';
import { applyFatigue } from './fatigue.js';
import { batterRates, pitcherRates } from './statConversion.js';
import { emptyBattingLine, emptyPitchingLine } from './boxScore.js';

export function createGame(awayTeam, homeTeam) {
  return {
    away: createTeamState(awayTeam),
    home: createTeamState(homeTeam),
    inning: 1,
    half: 'top',
    outs: 0,
    bases: emptyBases(),
    score: { away: 0, home: 0 },
    runsThisHalf: 0,
    lineScore: { away: [], home: [] },
    log: [],
    gameOver: false,
  };
}

function createTeamState(team) {
  const lineup = team.lineup.map((entry, idx) => ({
    id: `${team.abbrev}-B${idx}`,
    name: entry.name,
    position: entry.position,
    rates: batterRates(entry.batting),
    raw: entry.batting,
  }));

  const makePitcher = (entry) => ({
    id: `${team.abbrev}-P-${entry.name}`,
    name: entry.name,
    role: entry.role,
    rates: pitcherRates(entry.pitching),
    raw: entry.pitching,
    pitchCount: 0,
  });

  const pitchers = {
    starter: makePitcher(team.pitchers.starter),
    setup: makePitcher(team.pitchers.setup),
    closer: makePitcher(team.pitchers.closer),
  };

  const battingLines = new Map(lineup.map((p) => [p.id, emptyBattingLine(p)]));
  const pitchingLines = new Map(
    [pitchers.starter, pitchers.setup, pitchers.closer].map((p) => [p.id, emptyPitchingLine(p)])
  );

  return {
    name: team.name,
    abbrev: team.abbrev,
    lineup,
    battingIndex: 0,
    pitchers,
    activePitcher: pitchers.starter,
    battingLines,
    pitchingLines,
  };
}

// Fixed automatic bullpen usage: starter through inning 6, setup for 7-8,
// closer for 9+. Manager-controlled pitching changes are a later phase.
function pitcherForInning(inning, pitchers) {
  if (inning <= 6) return pitchers.starter;
  if (inning <= 8) return pitchers.setup;
  return pitchers.closer;
}

function ensureCorrectPitcher(state, fieldingTeam) {
  const desired = pitcherForInning(state.inning, fieldingTeam.pitchers);
  if (fieldingTeam.activePitcher.id !== desired.id) {
    state.log.push({
      inning: state.inning,
      half: state.half,
      text: `Pitching change: ${desired.name} (${desired.role}) takes the mound for ${fieldingTeam.name}.`,
      awayScore: state.score.away,
      homeScore: state.score.home,
    });
    fieldingTeam.activePitcher = desired;
  }
}

function updateBattingLine(line, outcome, result) {
  line.pa += 1;
  const isSacFly = outcome.type === 'OUT' && outcome.outType === 'flyout' && result.runsScored.length > 0;
  const isWalkOrHBP = outcome.type === 'BB' || outcome.type === 'HBP';
  if (!isWalkOrHBP && !isSacFly) line.ab += 1;

  if (outcome.type === 'BB') line.bb += 1;
  if (outcome.type === 'SO') line.so += 1;
  if (outcome.type === 'SINGLE') line.h += 1;
  if (outcome.type === 'DOUBLE') {
    line.h += 1;
    line.doubles += 1;
  }
  if (outcome.type === 'TRIPLE') {
    line.h += 1;
    line.triples += 1;
  }
  if (outcome.type === 'HR') {
    line.h += 1;
    line.hr += 1;
  }
  if (result.rbiEligible) line.rbi += result.runsScored.length;
}

function updatePitchingLine(line, outcome, result) {
  line.bf += 1;
  line.outs += result.outsRecorded;
  if (['SINGLE', 'DOUBLE', 'TRIPLE', 'HR'].includes(outcome.type)) line.h += 1;
  if (outcome.type === 'HR') line.hr += 1;
  if (outcome.type === 'BB') line.bb += 1;
  if (outcome.type === 'SO') line.so += 1;
  line.r += result.runsScored.length;
  line.er += result.runsScored.length; // no fielding-error model in v1: ER == R
}

function endHalfInning(state) {
  const scoreKey = state.half === 'top' ? 'away' : 'home';
  state.lineScore[scoreKey].push(state.runsThisHalf);
  state.runsThisHalf = 0;
  state.outs = 0;
  state.bases = emptyBases();

  if (state.half === 'top') {
    if (state.inning >= 9 && state.score.home > state.score.away) {
      state.gameOver = true;
      return;
    }
    state.half = 'bottom';
  } else {
    if (state.inning >= 9 && state.score.home !== state.score.away) {
      state.gameOver = true;
      return;
    }
    state.inning += 1;
    state.half = 'top';
  }
}

function checkWalkoff(state) {
  if (state.half === 'bottom' && state.inning >= 9 && state.score.home > state.score.away) {
    state.gameOver = true;
  }
}

// Advances the game by exactly one plate appearance.
export function advance(state, rng) {
  if (state.gameOver) return state;

  const battingTeam = state.half === 'top' ? state.away : state.home;
  const fieldingTeam = state.half === 'top' ? state.home : state.away;

  ensureCorrectPitcher(state, fieldingTeam);

  const batter = battingTeam.lineup[battingTeam.battingIndex % 9];
  const pitcher = fieldingTeam.activePitcher;
  const fatiguedRates = applyFatigue(pitcher.rates, pitcher.pitchCount);

  const outcome = resolveAtBat(batter.rates, fatiguedRates, rng);
  const result = advanceRunners(state.bases, state.outs, outcome, batter, rng);

  state.bases = result.bases;
  state.outs += result.outsRecorded;
  pitcher.pitchCount += 2 + Math.floor(rng() * 4); // ~2-5 pitches per PA

  updateBattingLine(battingTeam.battingLines.get(batter.id), outcome, result);
  updatePitchingLine(fieldingTeam.pitchingLines.get(pitcher.id), outcome, result);

  const scoreKey = state.half === 'top' ? 'away' : 'home';
  if (result.runsScored.length) {
    state.score[scoreKey] += result.runsScored.length;
    state.runsThisHalf += result.runsScored.length;
    for (const runner of result.runsScored) {
      const line = battingTeam.battingLines.get(runner.id);
      if (line) line.r += 1;
    }
  }

  state.log.push({
    inning: state.inning,
    half: state.half,
    text: result.log,
    awayScore: state.score.away,
    homeScore: state.score.home,
    outs: state.outs,
  });

  battingTeam.battingIndex += 1;

  if (state.outs >= 3) {
    endHalfInning(state);
  } else {
    checkWalkoff(state);
  }

  return state;
}

// Safety cap on plate appearances so a pathological RNG streak (e.g. endless
// extra innings) can't hang the UI.
const MAX_PLATE_APPEARANCES = 1000;

export function simulateGame(awayTeam, homeTeam, rng) {
  const state = createGame(awayTeam, homeTeam);
  let count = 0;
  while (!state.gameOver && count < MAX_PLATE_APPEARANCES) {
    advance(state, rng);
    count += 1;
  }
  return state;
}
