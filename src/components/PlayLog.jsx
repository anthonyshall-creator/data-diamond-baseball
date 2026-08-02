import { useEffect, useRef } from 'react';

export default function PlayLog({ state }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll only this box's own internal scrollbar to its bottom. Using
    // scrollIntoView here would also drag the outer page scroll position
    // along with it, since it walks every scrollable ancestor including the
    // window — which is what was yanking the diamond out of view.
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.log.length]);

  return (
    <div className="play-log">
      <h2>Play-by-Play</h2>
      <div className="play-log-scroll" ref={scrollRef}>
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
      </div>
    </div>
  );
}
