import { ipDisplay } from '../engine/boxScore.js';

function BattingTable({ teamState, teamName }) {
  const lines = teamState.lineup.map((p) => teamState.battingLines.get(p.id));
  const totals = lines.reduce(
    (acc, l) => ({
      ab: acc.ab + l.ab,
      r: acc.r + l.r,
      h: acc.h + l.h,
      rbi: acc.rbi + l.rbi,
      bb: acc.bb + l.bb,
      so: acc.so + l.so,
    }),
    { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0 }
  );

  return (
    <table className="box-table">
      <caption>{teamName} — Batting</caption>
      <thead>
        <tr>
          <th className="name-col">Player</th>
          <th>Pos</th>
          <th>AB</th>
          <th>R</th>
          <th>H</th>
          <th>RBI</th>
          <th>BB</th>
          <th>SO</th>
        </tr>
      </thead>
      <tbody>
        {teamState.lineup.map((p) => {
          const line = teamState.battingLines.get(p.id);
          return (
            <tr key={p.id}>
              <td className="name-col">{p.name}</td>
              <td>{p.position}</td>
              <td>{line.ab}</td>
              <td>{line.r}</td>
              <td>{line.h}</td>
              <td>{line.rbi}</td>
              <td>{line.bb}</td>
              <td>{line.so}</td>
            </tr>
          );
        })}
        <tr className="totals-row">
          <td className="name-col">Totals</td>
          <td></td>
          <td>{totals.ab}</td>
          <td>{totals.r}</td>
          <td>{totals.h}</td>
          <td>{totals.rbi}</td>
          <td>{totals.bb}</td>
          <td>{totals.so}</td>
        </tr>
      </tbody>
    </table>
  );
}

function PitchingTable({ teamState, teamName }) {
  const pitchers = [teamState.pitchers.starter, teamState.pitchers.setup, teamState.pitchers.closer];

  return (
    <table className="box-table">
      <caption>{teamName} — Pitching</caption>
      <thead>
        <tr>
          <th className="name-col">Pitcher</th>
          <th>Role</th>
          <th>IP</th>
          <th>H</th>
          <th>R</th>
          <th>ER</th>
          <th>BB</th>
          <th>SO</th>
        </tr>
      </thead>
      <tbody>
        {pitchers.map((p) => {
          const line = teamState.pitchingLines.get(p.id);
          if (line.bf === 0) return null;
          return (
            <tr key={p.id}>
              <td className="name-col">{p.name}</td>
              <td>{p.role}</td>
              <td>{ipDisplay(line.outs)}</td>
              <td>{line.h}</td>
              <td>{line.r}</td>
              <td>{line.er}</td>
              <td>{line.bb}</td>
              <td>{line.so}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function BoxScore({ state, away, home }) {
  return (
    <div className="boxscore">
      <BattingTable teamState={state.away} teamName={away.name} />
      <PitchingTable teamState={state.away} teamName={away.name} />
      <BattingTable teamState={state.home} teamName={home.name} />
      <PitchingTable teamState={state.home} teamName={home.name} />
    </div>
  );
}
