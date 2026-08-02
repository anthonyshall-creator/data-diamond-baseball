import { useEffect, useRef } from 'react';

export default function PlayLog({ state }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [state.log.length]);

  return (
    <div className="play-log">
      <h2>Play-by-Play</h2>
      <div className="play-log-scroll">
        {state.log.map((entry, i) => (
          <div key={i} className="play-log-line">
            <span className="play-log-inning">
              {entry.half === 'top' ? 'T' : 'B'}
              {entry.inning}
            </span>
            <span className="play-log-text">{entry.text}</span>
            <span className="play-log-score">
              {entry.awayScore}-{entry.homeScore}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
