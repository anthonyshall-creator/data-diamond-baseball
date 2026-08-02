import { LEAGUE_AVERAGE, FATIGUE_PITCH_THRESHOLD, FATIGUE_MAX_PENALTY, FATIGUE_PITCH_CAP_FOR_PENALTY } from './constants.js';

// Blends a pitcher's fresh rates toward league average (i.e. loses their edge)
// as pitch count climbs past the fatigue threshold, capturing the "tiring
// starter" effect that should prompt a bullpen decision.
export function applyFatigue(freshRates, pitchCount) {
  if (pitchCount <= FATIGUE_PITCH_THRESHOLD) return freshRates;

  const overage = pitchCount - FATIGUE_PITCH_THRESHOLD;
  const span = FATIGUE_PITCH_CAP_FOR_PENALTY - FATIGUE_PITCH_THRESHOLD;
  const penalty = Math.min(FATIGUE_MAX_PENALTY, (overage / span) * FATIGUE_MAX_PENALTY);

  const blended = {};
  for (const key of Object.keys(freshRates)) {
    const lg = LEAGUE_AVERAGE[key] ?? freshRates[key];
    blended[key] = freshRates[key] * (1 - penalty) + lg * penalty;
  }
  return blended;
}

export function fatigueLevel(pitchCount) {
  if (pitchCount <= FATIGUE_PITCH_THRESHOLD) return 'fresh';
  if (pitchCount <= FATIGUE_PITCH_CAP_FOR_PENALTY) return 'tiring';
  return 'gassed';
}
