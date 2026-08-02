// Log5 odds-ratio method for blending a batter's and pitcher's rate for the
// same event against a league-average baseline for that event.
export function log5(batterRate, pitcherRate, leagueRate) {
  const pA = clamp(batterRate);
  const pB = clamp(pitcherRate);
  const pLg = clamp(leagueRate);

  const oddsA = pA / (1 - pA);
  const oddsB = pB / (1 - pB);
  const oddsLg = pLg / (1 - pLg);

  const combinedOdds = (oddsA * oddsB) / oddsLg;
  return combinedOdds / (1 + combinedOdds);
}

function clamp(p) {
  return Math.min(0.999, Math.max(0.001, p));
}
