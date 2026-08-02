# Baseball Sim

[![CI](https://github.com/anthonyshall-creator/baseball-sim/actions/workflows/ci.yml/badge.svg)](https://github.com/anthonyshall-creator/baseball-sim/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-proprietary-lightgrey)

A stat-based baseball simulator in the spirit of *Micro League Baseball*: real
player stats drive probabilistic at-bat outcomes, rather than arcade-style
reflexes or direct player control. v1 is a single exhibition game between the
2021 Atlanta Braves and 2021 Houston Astros, using each team's actual
season stat lines.

## Running it

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. Click **Next Play** to step one plate
appearance at a time, or **Play Ball** to simulate the full game instantly.
**New Game** resets and replays with fresh randomness.

```bash
npm test
```

Runs the engine's Vitest suite, including a statistical check that simulates
20,000 plate appearances and confirms batters converge to within a few points
of their real batting average.

## How the simulation works

`src/engine/` is pure logic with no UI dependencies:

- **`statConversion.js`** turns each player's raw counting stats (PA, AB, H,
  2B/3B/HR, BB, SO, HBP for batters; BF, H, BB, SO, HR for pitchers) into
  per-plate-appearance event rates.
- **`log5.js`** blends a batter's and pitcher's rate for each event (walk,
  strikeout, homer, hit, etc.) against a league-average baseline, using the
  standard sabermetric log5 odds-ratio method. The baseline is derived from
  the two teams' own combined stats rather than an outside data source.
- **`atBat.js`** rolls the blended probabilities to resolve one plate
  appearance into a walk, HBP, strikeout, homer, single/double/triple, or an
  out (further split into groundout/flyout/lineout by a league-typical
  batted-ball profile).
- **`baseRunning.js`** applies that outcome to the current base/out state:
  force plays, double plays, sacrifice flies, tag-ups, extra-base advances.
- **`fatigue.js`** degrades a pitcher's rates toward league average as their
  pitch count climbs past 75, so tiring starters get hit harder late.
- **`gameState.js`** runs the 9-inning (+extras) game loop, rotates each
  team's fixed starter → setup → closer bullpen, and aggregates the batting
  and pitching box scores as the game plays out.

## Data

`src/data/teams/` holds each team's 9-batter lineup plus starter/setup/closer,
entered by hand from Baseball-Reference's 2021 season totals. See
`statConversion.js` for the exact fields each player record needs if you want
to add another team.

## What's not here yet

This is Phase 1 of the build (see the original build prompt for the full
roadmap). Not yet implemented: the pixel-art animated diamond, manager
controls (pinch hitters, steals, bunts, mid-game pitching changes), a
roster/team editor, and season/series/franchise modes. The engine is
structured to support all of these without a rewrite.
