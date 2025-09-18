import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const BIN_META = [
  { key: "plastic", label: "Plastic", color: "border-cyan-500" },
  { key: "organic", label: "Organic", color: "border-emerald-500" },
  { key: "metal", label: "Metal", color: "border-amber-500" },
];
const ITEMS = [
  { name: "Bottle", type: "plastic" },
  { name: "Straw", type: "plastic" },
  { name: "Can", type: "metal" },
  { name: "Tin", type: "metal" },
  { name: "Apple Core", type: "organic" },
  { name: "Peel", type: "organic" },
];

function randItem(level) {
  const pool = ITEMS;
  return {
    ...pool[Math.floor(Math.random() * pool.length)],
    id: Math.random().toString(36).slice(2),
  };
}

export function WasteSort() {
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(45);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [queue, setQueue] = useState([]);
  const [ended, setEnded] = useState(false);
  const [lb, setLb] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const ticking = useRef(null);

  useEffect(() => {
    setQueue(Array.from({ length: 4 }, () => randItem(level)));
  }, [level]);

  useEffect(() => {
    if (showIntro || ended) return;
    if (time <= 0 || lives <= 0) {
      endGame();
      return;
    }
    ticking.current = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(ticking.current);
  }, [time, lives, ended, showIntro]);

  function onDrop(binKey, item) {
    setQueue((prev) =>
      prev.filter((i) => i.id !== item.id).concat(randItem(level))
    );
    if (binKey === item.type) {
      const base = 10;
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((s) => s + base + newCombo * 2);
      setTime((t) => t + 1);
    } else {
      setCombo(0);
      setLives((l) => l - 1);
    }
  }

  async function endGame() {
    setEnded(true);
    try {
      await api.post("/games/waste-sort/score", { score });
      const r = await api.get("/games/waste-sort/leaderboard");
      setLb(r.data);
    } catch {}
  }

  function playAgain() {
    setLevel(1);
    setTime(45);
    setLives(3);
    setScore(0);
    setCombo(0);
    setEnded(false);
    setShowIntro(true);
    setQueue(Array.from({ length: 4 }, () => randItem(1)));
  }

  const rules = [
    "Drag items into the correct bins: Plastic, Organic, Metal.",
    "Correct drop: +10 and combo bonus; Wrong: lose a life.",
    "Each correct drop adds +1s. You have 45s and 3 lives.",
    "Level up to increase challenge!",
  ];

  return (
    <div className="space-y-4">
      <GameHeader
        title="Waste Sorting"
        score={score}
        time={time}
        level={level}
      />
      {showIntro && (
        <GameIntro
          title="Waste Sorting"
          description="Sort waste into the right bins to learn proper recycling."
          rules={rules}
          onStart={() => setShowIntro(false)}
        />
      )}
      <div className="flex items-center gap-4 text-sm text-neutral-300">
        <div>
          Lives:{" "}
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>❤</span>
          ))}
        </div>
        <div>Combo: x{combo}</div>
      </div>
      <div className="flex gap-3 min-h-[56px]">
        {queue.map((item) => (
          <div
            key={item.id}
            draggable={!showIntro && !ended}
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", JSON.stringify(item))
            }
            className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700 shadow hover:shadow-emerald-500/20 transition"
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {BIN_META.map((b) => (
          <div
            key={b.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (showIntro || ended) return;
              const it = JSON.parse(e.dataTransfer.getData("text/plain"));
              onDrop(b.key, it);
            }}
            className={`h-32 rounded-xl border-2 border-dashed ${b.color} bg-neutral-900 flex items-center justify-center text-lg font-medium`}
          >
            {b.label}
          </div>
        ))}
      </div>
      {score >= level * 100 && !ended && !showIntro && (
        <div className="text-emerald-400 text-sm">
          Great! Level up to increase challenge.
          <button
            onClick={() => {
              setLevel((l) => l + 1);
              setTime((t) => t + 15);
            }}
            className="ml-2 px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs"
          >
            Level Up
          </button>
        </div>
      )}

      {ended && (
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900 space-y-3">
          <div className="text-lg font-semibold">Round Over</div>
          <div>
            Your score: <span className="font-bold">{score}</span>
          </div>
          <div>
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
          <div className="flex gap-2">
            <button
              onClick={playAgain}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              Play Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
