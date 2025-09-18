import { useEffect, useRef, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const questions = [
  { q: "Best for hydration?", a: "Water" },
  { q: "Reusable option?", a: "Bottle" },
  { q: "Clean energy?", a: "Solar" },
];

export function PlantTree() {
  const [idx, setIdx] = useState(0);
  const [height, setHeight] = useState(10);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [ended, setEnded] = useState(false);
  const [lb, setLb] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (ended || showIntro) return;
    if (time <= 0) return end();
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, ended, showIntro]);

  function answer(val) {
    if (ended || showIntro) return;
    const correct = questions[idx].a;
    if (val === correct) {
      setHeight((h) => Math.min(100, h + 20));
      setScore((s) => s + 10);
    }
    if (idx + 1 >= questions.length) end();
    else setIdx((i) => i + 1);
  }

  async function end() {
    setEnded(true);
    const timeTaken = Math.max(
      1,
      Math.round((Date.now() - startRef.current) / 1000)
    );
    const weighted = score + Math.max(0, 30 - timeTaken);
    try {
      await api.post("/games/plant-tree/score", { score: weighted });
      const r = await api.get("/games/plant-tree/leaderboard");
      setLb(r.data);
    } catch {}
  }

  const rules = [
    "Answer eco-questions to grow the tree (+10 each correct).",
    "Faster completion adds a time bonus to your final score.",
    "You have 45 seconds.",
  ];

  return (
    <div className="space-y-4">
      <GameHeader title="Plant the Tree" score={score} time={time} level={1} />
      {showIntro && (
        <GameIntro
          title="Plant the Tree"
          description="Answer quick eco-questions to help your tree grow stronger."
          rules={rules}
          onStart={() => setShowIntro(false)}
        />
      )}
      <div className="w-full h-32 border border-neutral-700 rounded bg-neutral-900 flex items-end">
        <div
          style={{ height: height + "%" }}
          className="w-6 bg-emerald-600 mx-4 rounded-t transition-all duration-300"
        />
      </div>
      <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
        <div className="mb-2">
          {questions[idx]?.q || (ended ? "Done!" : "")}
        </div>
        <div className="flex gap-2">
          {["Water", "Bottle", "Solar", "Coal"].map((v) => (
            <button
              key={v}
              disabled={ended || showIntro}
              onClick={() => answer(v)}
              className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700"
            >
              {v}
            </button>
          ))}
        </div>
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
