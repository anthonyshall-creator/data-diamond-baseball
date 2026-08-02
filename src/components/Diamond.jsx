import { useEffect, useState } from 'react';
import './Diamond.css';

// All coordinates are in a 0-100 percentage-style space matching the SVG
// viewBox, with home plate at the bottom and second base at the top.
const POS = {
  home: { x: 50, y: 90 },
  first: { x: 73, y: 65 },
  second: { x: 50, y: 40 },
  third: { x: 27, y: 65 },
  mound: { x: 50, y: 67 },
};

const BASE_KEYS = ['first', 'second', 'third'];

function randomTarget(base, spread) {
  const x = base.x + (Math.random() * 2 - 1) * spread;
  return { x: Math.max(4, Math.min(96, x)), y: base.y };
}

// Cosmetic batted-ball landing spots by outcome — not tied to the engine's
// RNG, just enough variety that replays don't look identical.
const HIT_TARGETS = {
  groundout: () => randomTarget({ x: 50, y: 58 }, 22),
  lineout: () => randomTarget({ x: 50, y: 42 }, 20),
  flyout: () => randomTarget({ x: 50, y: 18 }, 26),
  SINGLE: () => randomTarget({ x: 50, y: 38 }, 24),
  DOUBLE: () => randomTarget({ x: 50, y: 20 }, 28),
  TRIPLE: () => randomTarget({ x: 22, y: 12 }, 6),
  HR: () => randomTarget({ x: 50, y: 4 }, 30),
};

function ballTargetFor(outcome) {
  const fn = outcome.type === 'OUT' ? HIT_TARGETS[outcome.outType] : HIT_TARGETS[outcome.type];
  return fn ? fn() : null;
}

const RUNNER_ANIMATION_MS = 700;

export default function Diamond({ lastPlay }) {
  const [runners, setRunners] = useState({});
  const [ball, setBall] = useState(null);

  useEffect(() => {
    if (!lastPlay) return;

    // Give a freshly-arriving batter a starting position (home plate) so the
    // CSS transition to their eventual base has something to animate from.
    setRunners((prev) => ({
      ...prev,
      [lastPlay.batter.id]: { name: lastPlay.batter.name, ...POS.home },
    }));

    const ballTarget = ballTargetFor(lastPlay.outcome);
    if (ballTarget) setBall({ ...POS.home });

    const raf = requestAnimationFrame(() => {
      // Rebuild from the ground truth of this play's result — anyone not
      // still on base or actively scoring is simply dropped (out, or a
      // stranded runner from a half-inning that just ended).
      setRunners(() => {
        const next = {};
        for (const key of BASE_KEYS) {
          const r = lastPlay.basesAfter[key];
          if (r) next[r.id] = { name: r.name, ...POS[key] };
        }
        for (const scorer of lastPlay.runsScored) {
          next[scorer.id] = { name: scorer.name, ...POS.home };
        }
        return next;
      });
      if (ballTarget) setBall(ballTarget);
    });

    const cleanupTimer = setTimeout(() => {
      if (lastPlay.runsScored.length) {
        setRunners((prev) => {
          const next = { ...prev };
          for (const scorer of lastPlay.runsScored) delete next[scorer.id];
          return next;
        });
      }
      setBall(null);
    }, RUNNER_ANIMATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cleanupTimer);
    };
  }, [lastPlay]);

  return (
    <svg className="diamond" viewBox="0 0 100 100" role="img" aria-label="Baseball diamond">
      <rect className="grass" x="0" y="0" width="100" height="100" />
      <path className="outfield-arc" d="M 6,40 Q 50,-6 94,40" />
      <line className="foul-line" x1={POS.home.x} y1={POS.home.y} x2="4" y2="26" />
      <line className="foul-line" x1={POS.home.x} y1={POS.home.y} x2="96" y2="26" />
      <polygon
        className="infield-dirt"
        points={`${POS.home.x},${POS.home.y} ${POS.first.x},${POS.first.y} ${POS.second.x},${POS.second.y} ${POS.third.x},${POS.third.y}`}
      />

      <circle className="mound-dirt" cx={POS.mound.x} cy={POS.mound.y} r="4.5" />

      {BASE_KEYS.map((key) => (
        <rect
          key={key}
          className="base"
          x={POS[key].x - 2.2}
          y={POS[key].y - 2.2}
          width="4.4"
          height="4.4"
          transform={`rotate(45 ${POS[key].x} ${POS[key].y})`}
        />
      ))}
      <polygon
        className="home-plate"
        points={`${POS.home.x - 2.5},${POS.home.y - 1.5} ${POS.home.x + 2.5},${POS.home.y - 1.5} ${
          POS.home.x + 2.5
        },${POS.home.y + 1} ${POS.home.x},${POS.home.y + 3} ${POS.home.x - 2.5},${POS.home.y + 1}`}
      />

      <g transform={`translate(${POS.mound.x} ${POS.mound.y - 3})`}>
        <g className="sprite pitcher">
          <rect className="sprite-body" x="-1.6" y="-1" width="3.2" height="3.4" />
          <rect className="sprite-head" x="-1.1" y="-2.6" width="2.2" height="2" />
        </g>
      </g>

      <g transform={`translate(${POS.home.x - 5} ${POS.home.y - 3})`}>
        <g className="sprite batter">
          <rect className="sprite-body" x="-1.6" y="-1" width="3.2" height="3.4" />
          <rect className="sprite-head" x="-1.1" y="-2.6" width="2.2" height="2" />
        </g>
      </g>

      {Object.entries(runners).map(([id, r]) => (
        <circle key={id} className="runner" cx={r.x} cy={r.y} r="2.6">
          <title>{r.name}</title>
        </circle>
      ))}

      {ball && <circle className="ball" cx={ball.x} cy={ball.y} r="1.3" />}
    </svg>
  );
}
