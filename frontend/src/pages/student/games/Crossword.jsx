import { useEffect, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const grid = [
  ["W", "A", "T", "E", "R"],
  ["I", "N", "D", "S", "O"],
  ["N", "S", "O", "L", "A"],
  ["D", "U", "S", "T", "L"],
  ["B", "I", "O", "D", "I"],
];
const words = ["WATER", "WIND", "SOLAR", "BIO"];

export function Crossword() {
  const [found, setFound] = useState([]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);
  const [ended, setEnded] = useState(false);
  const [lb, setLb] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const score = found.length * 10;

  useEffect(() => {
    if (ended || showIntro) return;
    if (time <= 0) return finish();
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, ended, showIntro]);

  function submit() {
    if (showIntro || ended) return;
    const up = input.toUpperCase().trim();
    if (words.includes(up) && !found.includes(up)) setFound([...found, up]);
    setInput("");
  }

  async function finish() {
    setEnded(true);
    try {
      await api.post("/games/crossword/score", { score });
      const r = await api.get("/games/crossword/leaderboard");
      setLb(r.data);
    } catch {}
  }

  const rules = [
    "Find eco words in the grid: WATER, WIND, SOLAR, BIO.",
    "Each correct word is +10 points.",
    "You have 60 seconds.",
  ];

  return (
    <div className="space-y-4">
      <GameHeader title="Eco Crossword" score={score} time={time} level={1} />
      {showIntro && (
        <GameIntro
          title="Eco Crossword"
          description="Hunt for eco-terms in the grid to reinforce key concepts."
          rules={rules}
          onStart={() => setShowIntro(false)}
        />
      )}
      <div className="grid grid-cols-5 gap-1">
        {grid.flat().map((c, idx) => (
          <div
            key={idx}
            className="w-8 h-8 rounded border border-neutral-700 bg-neutral-900 flex items-center justify-center text-sm"
          >
            {c}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type word"
          className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700"
        />
        <button
          disabled={ended}
          onClick={submit}
          className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700"
        >
          Add
        </button>
        <button
          disabled={ended}
          onClick={finish}
          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
        >
          Finish
        </button>
      </div>
      <div className="text-xs text-neutral-400">
        Found: {found.join(", ") || "None"}
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
