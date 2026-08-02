function cell(arr, i) {
  return i < arr.length ? arr[i] : '';
}

function totalHits(teamState) {
  let total = 0;
  for (const line of teamState.battingLines.values()) total += line.h;
  return total;
}

export default function LineScore({ state, away, home }) {
  const innings = Math.max(state.lineScore.away.length, state.lineScore.home.length, 9);

  return (
    <table className="linescore">
      <thead>
        <tr>
          <th className="team-col">Team</th>
          {Array.from({ length: innings }, (_, i) => (
            <th key={i}>{i + 1}</th>
          ))}
          <th>R</th>
          <th>H</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="team-col">{away.abbrev}</td>
          {Array.from({ length: innings }, (_, i) => (
            <td key={i}>{cell(state.lineScore.away, i)}</td>
          ))}
          <td className="total">{state.score.away}</td>
          <td className="total">{totalHits(state.away)}</td>
        </tr>
        <tr>
          <td className="team-col">{home.abbrev}</td>
          {Array.from({ length: innings }, (_, i) => (
            <td key={i}>{cell(state.lineScore.home, i)}</td>
          ))}
          <td className="total">{state.score.home}</td>
          <td className="total">{totalHits(state.home)}</td>
        </tr>
      </tbody>
    </table>
  );
}
