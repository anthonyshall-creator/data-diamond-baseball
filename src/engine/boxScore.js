export function emptyBattingLine(player) {
  return { player, pa: 0, ab: 0, r: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, bb: 0, so: 0 };
}

export function emptyPitchingLine(player) {
  return { player, outs: 0, bf: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0 };
}

export function ipDisplay(outs) {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}
