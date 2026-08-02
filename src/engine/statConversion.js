// Converts raw counting stat lines into per-plate-appearance (or
// per-batter-faced) event rates used by the at-bat resolver.

export function batterRates(batting) {
  const { pa, h, doubles, triples, hr, bb, so, hbp } = batting;
  const singles = h - doubles - triples - hr;
  return {
    bb: bb / pa,
    hbp: hbp / pa,
    so: so / pa,
    hr: hr / pa,
    single: singles / pa,
    double: doubles / pa,
    triple: triples / pa,
    hit: (h - hr) / pa, // non-HR hits, for matchup blending
  };
}

export function pitcherRates(pitching) {
  const { bf, h, bb, so, hr, hbp } = pitching;
  return {
    bb: bb / bf,
    hbp: hbp / bf,
    so: so / bf,
    hr: hr / bf,
    hit: (h - hr) / bf,
  };
}
