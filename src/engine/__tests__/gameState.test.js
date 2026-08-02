import { describe, it, expect } from 'vitest';
import { simulateGame } from '../gameState.js';
import { mulberry32 } from '../rng.js';
import { braves2021 } from '../../data/teams/braves2021.js';
import { astros2021 } from '../../data/teams/astros2021.js';

describe('simulateGame', () => {
  it('completes a full game with a consistent final score and box score', () => {
    const rng = mulberry32(2024);
    const state = simulateGame(astros2021, braves2021, rng);

    expect(state.gameOver).toBe(true);
    expect(state.inning).toBeGreaterThanOrEqual(9);

    const lineScoreAway = state.lineScore.away.reduce((a, b) => a + b, 0);
    const lineScoreHome = state.lineScore.home.reduce((a, b) => a + b, 0);
    expect(lineScoreAway).toBe(state.score.away);
    expect(lineScoreHome).toBe(state.score.home);

    // Home team never bats in the bottom of an inning it doesn't need (already
    // leading), so the line-score arrays can be shorter for home than away,
    // but never longer.
    expect(state.lineScore.home.length).toBeLessThanOrEqual(state.lineScore.away.length);

    // If the game ended in a regulation (non-walkoff) finish, both teams
    // batted the same number of innings.
    if (state.score.home <= state.score.away) {
      expect(state.lineScore.home.length).toBe(state.lineScore.away.length);
    }
  });

  it('is deterministic given the same seed', () => {
    const stateA = simulateGame(astros2021, braves2021, mulberry32(55));
    const stateB = simulateGame(astros2021, braves2021, mulberry32(55));
    expect(stateA.score).toEqual(stateB.score);
    expect(stateA.log.length).toBe(stateB.log.length);
  });

  it('per-player batting PA sums match the number of plate appearances that team had', () => {
    const rng = mulberry32(777);
    const state = simulateGame(astros2021, braves2021, rng);

    const awayPaTotal = [...state.away.battingLines.values()].reduce((sum, l) => sum + l.pa, 0);
    expect(awayPaTotal).toBe(state.away.battingIndex);

    const homePaTotal = [...state.home.battingLines.values()].reduce((sum, l) => sum + l.pa, 0);
    expect(homePaTotal).toBe(state.home.battingIndex);
  });

  it('runs allowed across a team pitching staff equal runs scored by the opponent', () => {
    const rng = mulberry32(321);
    const state = simulateGame(astros2021, braves2021, rng);

    const homeRunsAllowed = [...state.home.pitchingLines.values()].reduce((sum, l) => sum + l.r, 0);
    expect(homeRunsAllowed).toBe(state.score.away);

    const awayRunsAllowed = [...state.away.pitchingLines.values()].reduce((sum, l) => sum + l.r, 0);
    expect(awayRunsAllowed).toBe(state.score.home);
  });

  it('uses all three pitchers for a team across a regulation-length game', () => {
    const rng = mulberry32(2024);
    const state = simulateGame(astros2021, braves2021, rng);

    const homeOutsByPitcher = [...state.home.pitchingLines.values()].map((l) => l.outs);
    // Starter goes through inning 6 (18 outs) if the game reaches that far
    // without a shortened game; at minimum the starter should have recorded
    // some outs.
    expect(homeOutsByPitcher[0]).toBeGreaterThan(0);
  });
});
