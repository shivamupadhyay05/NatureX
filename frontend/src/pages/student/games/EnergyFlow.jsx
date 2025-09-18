import { useEffect, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const sources = [
  { id: "solar", name: "Solar" },
  { id: "wind", name: "Wind" },
  { id: "hydro", name: "Hydro" },
];
const homes = [
  { id: "home1", name: "Home A" },
  { id: "home2", name: "Home B" },
  { id: "school", name: "School" },
];
const correct = { home1: "solar", home2: "wind", school: "hydro" };

export function EnergyFlow() {
  const [links, setLinks] = useState({});
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [ended, setEnded] = useState(false);
  const [lb, setLb] = useState([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (ended || showIntro) return;
    if (time <= 0) return finish();
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, ended, showIntro]);

  function connect(homeId, sourceId) {
    if (ended || showIntro) return;
    setLinks((prev) => ({ ...prev, [homeId]: sourceId }));
    if (correct[homeId] === sourceId) setScore((s) => s + 10);
  }

  async function finish() {
    setEnded(true);
    try {
      await api.post("/games/energy-flow/score", { score });
      const r = await api.get("/games/energy-flow/leaderboard");
      setLb(r.data);
    } catch {}
  }

  const rules = [
    "Connect each home to the correct renewable source.",
    "Correct connection: +10 points.",
    "You have 45 seconds. Finish when ready to submit.",
  ];

  return (
    <div className="space-y-4">
      <GameHeader title="Energy Flow" score={score} time={time} level={1} />
      {showIntro && (
        <GameIntro
          title="Energy Flow"
          description="Match homes to the right renewable source to learn clean energy mapping."
          rules={rules}
          onStart={() => setShowIntro(false)}
        />
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm text-neutral-400">Sources</h4>
          {sources.map((s) => (
            <div key={s.id} className="flex gap-2">
              {homes.map((h) => (
                <button
                  key={h.id + ":" + s.id}
                  disabled={ended || showIntro}
                  className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-left flex-1"
                  onClick={() => connect(h.id, s.id)}
                >
                  Connect {h.name} to {s.name}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-sm text-neutral-400">Connections</h4>
          {homes.map((h) => (
            <div key={h.id} className="text-sm">
              {h.name} → {links[h.id] || "None"}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          disabled={ended || showIntro}
          onClick={finish}
          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
        >
          Finish
        </button>
        {ended && (
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700"
          >
            Play Again
          </button>
        )}
      </div>
      {ended && (
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="text-sm text-neutral-400 mb-1">Leaderboard</div>
          <div className="space-y-1 max-h-48 overflow-auto">
            {lb.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="text-neutral-300">
                  {i + 1}. {row.name}
                </div>
                <div className="font-medium">{row.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
