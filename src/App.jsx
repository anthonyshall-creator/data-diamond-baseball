import { useRef, useState } from 'react';
import { createGame, advance } from './engine/gameState.js';
import { astros2021 } from './data/teams/astros2021.js';
import { braves2021 } from './data/teams/braves2021.js';
import LineScore from './components/LineScore.jsx';
import BoxScore from './components/BoxScore.jsx';
import PlayLog from './components/PlayLog.jsx';
import Diamond from './components/Diamond.jsx';
import './App.css';

const AWAY = astros2021;
const HOME = braves2021;
const MAX_PLATE_APPEARANCES_PER_CLICK = 1000;

function baseDescription(bases) {
  const parts = [];
  if (bases.first) parts.push('1st');
  if (bases.second) parts.push('2nd');
  if (bases.third) parts.push('3rd');
  return parts.length ? `Runners on ${parts.join(', ')}` : 'Bases empty';
}

function GameStatus({ state }) {
  if (state.gameOver) {
    const awayWon = state.score.away > state.score.home;
    const winner = awayWon ? AWAY.name : HOME.name;
    const winnerScore = awayWon ? state.score.away : state.score.home;
    const loserScore = awayWon ? state.score.home : state.score.away;
    return (
      <div className="status status-final">
        Final: {winner} win, {winnerScore}-{loserScore}
      </div>
    );
  }
  return (
    <div className="status">
      {state.half === 'top' ? 'Top' : 'Bottom'} {state.inning} &middot; {state.outs} out
      {state.outs === 1 ? '' : 's'} &middot; {baseDescription(state.bases)}
    </div>
  );
}

export default function App() {
  const gameRef = useRef(createGame(AWAY, HOME));
  const [, setTick] = useState(0);
  const [gameId, setGameId] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const state = gameRef.current;

  function nextPlay() {
    if (state.gameOver) return;
    advance(state, Math.random);
    rerender();
  }

  function playBall() {
    let guard = 0;
    while (!state.gameOver && guard < MAX_PLATE_APPEARANCES_PER_CLICK) {
      advance(state, Math.random);
      guard += 1;
    }
    rerender();
  }

  function newGame() {
    gameRef.current = createGame(AWAY, HOME);
    setGameId((id) => id + 1);
    rerender();
  }

  return (
    <div className="app">
      <header>
        <h1>Data Diamond Baseball</h1>
        <p className="matchup">
          {AWAY.name} @ {HOME.name} <span className="season-tag">2021 season stats</span>
        </p>
      </header>

      <div className="controls">
        <button onClick={nextPlay} disabled={state.gameOver}>
          Next Play
        </button>
        <button onClick={playBall} disabled={state.gameOver} className="primary">
          Play Ball
        </button>
        <button onClick={newGame}>New Game</button>
      </div>

      <GameStatus state={state} />
      <Diamond key={gameId} lastPlay={state.lastPlay} />
      <LineScore state={state} away={AWAY} home={HOME} />

      <div className="columns">
        <PlayLog state={state} />
        <BoxScore state={state} away={AWAY} home={HOME} />
      </div>
    </div>
  );
}
