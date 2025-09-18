import { useEffect, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const bins = ["plastic", "organic", "metal"];
const items = [
  { label: "Bottle", type: "plastic" },
  { label: "Can", type: "metal" },
  { label: "Leaf", type: "organic" },
];

export function RecycleDash() {
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [ended, setEnded] = useState(false);
  const [lb, setLb] = useState([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    nextItem();
  }, []);
  useEffect(() => {
    if (ended || showIntro) return;
    if (time <= 0) return finish();
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [ended, time, showIntro]);

  function nextItem() {
    setCurrent(items[Math.floor(Math.random() * items.length)]);
  }

  function choose(bin) {
    if (!current || ended || showIntro) return;
    if (bin === current.type) setScore((s) => s + 5);
    nextItem();
  }

  async function finish() {
    setEnded(true);
    try {
      await api.post("/games/recycle-dash/score", { score });
      const r = await api.get("/games/recycle-dash/leaderboard");
      setLb(r.data);
    } catch {}
  }

  const rules = [
    "You have 30 seconds to sort items.",
    "Click the correct bin for each item (+5).",
    "Plastic, organic, and metal only.",
  ];

  return (
    <div className="space-y-4">
      <GameHeader title="Recycle Dash" score={score} time={time} level={1} />
      {showIntro && (
        <GameIntro
          title="Recycle Dash"
          description="Quickly sort items into the right bins to sharpen recycling habits."
          rules={rules}
          onStart={() => setShowIntro(false)}
        />
      )}
      <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900 text-center">
        <div className="text-lg">Catch: {current?.label || "..."}</div>
      </div>
      <div className="flex gap-3">
        {bins.map((b) => (
          <button
            key={b}
            disabled={ended || showIntro}
            onClick={() => choose(b)}
            className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 capitalize"
          >
            {b}
          </button>
        ))}
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
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
