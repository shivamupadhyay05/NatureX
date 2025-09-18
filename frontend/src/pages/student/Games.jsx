import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../shared/api";

const games = [
  { key: "waste-sort", name: "Waste Sorting Puzzle" },
  { key: "energy-flow", name: "Energy Flow Puzzle" },
  { key: "crossword", name: "Eco Crossword" },
  { key: "plant-tree", name: "Plant the Tree" },
  { key: "recycle-dash", name: "Recycle Dash" },
  { key: "trash-flight", name: "Trash Flight (Recycle Runner)" },
];

export function Games() {
  const [bests, setBests] = useState({});

  useEffect(() => {
    (async () => {
      const obj = {};
      for (const g of games) {
        try {
          const res = await api.get(`/games/${g.key}/me`);
          obj[g.key] = res.data.best?.score || 0;
        } catch {}
      }
      setBests(obj);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mini Games</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {games.map((g) => (
          <Link
            key={g.key}
            to={`/game/${g.key}`}
            className="rounded-lg border border-neutral-800 p-4 bg-neutral-900 block hover:bg-neutral-800"
          >
            <div className="font-medium">{g.name}</div>
            <div className="text-xs text-neutral-400">
              Best score: {bests[g.key] ?? 0}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
