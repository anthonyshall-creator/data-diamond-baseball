// League-average per-PA outcome rates, derived from the combined 2021 Braves +
// Astros non-pitcher batting lines (the only two offenses in this sim). Used as
// the baseline for log5 matchup blending, not an official MLB figure.
export const LEAGUE_AVERAGE = {
  bb: 0.09233,
  hbp: 0.01082,
  so: 0.20941,
  hr: 0.03813,
  hit: 0.19197, // non-HR hits allowed, per PA/BF
};

// Typical MLB batted-ball profile for outs in play (no play-by-play batted-ball
// data is tracked per player in this v1, so the split is applied league-wide).
export const BATTED_BALL_SPLIT = {
  groundout: 0.44,
  flyout: 0.35,
  lineout: 0.21,
};

// Chance a groundout with a force at second becomes a double play.
export const DOUBLE_PLAY_CHANCE = 0.4;

// Chance a fly ball with a runner on third and fewer than 2 outs scores the
// runner on a sacrifice fly / tag-up.
export const TAG_UP_SCORE_CHANCE = 0.65;

// Average batters faced per 9 innings pitched, used to convert /9 rate stats
// into per-batter-faced rates when raw BF isn't available.
export const BF_PER_9 = 38.5;

// Pitch-count fatigue: past this many pitches, the pitcher's allowed rates
// begin sliding toward (and past) league average.
export const FATIGUE_PITCH_THRESHOLD = 75;
export const FATIGUE_MAX_PENALTY = 0.35; // at ~120+ pitches, blend 35% toward "tired"
export const FATIGUE_PITCH_CAP_FOR_PENALTY = 120;

// Rough average pitches thrown per batter faced, used to track pitch count.
export const PITCHES_PER_BATTER = 3.9;
