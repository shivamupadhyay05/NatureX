import { useEffect, useRef, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";
import { GameIntro } from "./_GameIntro";

const W = 520,
  H = 320;
const COLORS = {
  bg1: "#0ea5e9",
  bg2: "#22c55e",
  player: "#f59e0b",
  recycle: "#22d3ee",
  hazard: "#ef4444",
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeSprite(fill, size = 14) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><circle cx='${
    size / 2
  }' cy='${size / 2}' r='${size / 2}' fill='${fill}'/></svg>`;
  const img = new Image();
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  return img;
}

export function TrashFlight() {
  const cRef = useRef(null);
  const raf = useRef(0);
  const audio = useRef(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [tip, setTip] = useState("Separate plastic, metal, and organics!");
  const tips = [
    "Recycling 1 can saves enough energy to power a TV for 3 hours.",
    "Compost organics to cut methane emissions.",
    "Choose reusable bottles to cut plastic waste.",
    "Clean recyclables improve recycling quality.",
  ];
  const player = useRef({ x: 80, y: H / 2, vy: 0 });
  const items = useRef([]);
  const keys = useRef({});
  const sprites = useRef({
    player: makeSprite(COLORS.player, 18),
    recycle: makeSprite(COLORS.recycle, 12),
    hazard: makeSprite(COLORS.hazard, 14),
  });

  function sfx(type) {
    try {
      if (!audio.current)
        audio.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      const ctx = audio.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type === "hit" ? "square" : "sine";
      o.frequency.value = type === "hit" ? 180 : 520;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  useEffect(() => {
    const c = cRef.current;
    const ctx = c.getContext("2d");

    function spawn() {
      const type = Math.random() < 0.7 ? "recycle" : "hazard";
      items.current.push({
        x: W + 20,
        y: rand(40, H - 40),
        vx: rand(2, 3.5),
        type,
      });
    }
    function drawBg() {
      ctx.fillStyle = COLORS.bg1;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COLORS.bg2;
      ctx.fillRect(0, H - 40, W, 40);
    }
    function drawPlayer() {
      const img = sprites.current.player;
      ctx.drawImage(img, player.current.x - 9, player.current.y - 9);
    }
    function drawItems() {
      for (const it of items.current) {
        const img = sprites.current[it.type];
        const s = it.type === "recycle" ? 12 : 14;
        ctx.drawImage(img, it.x - s / 2, it.y - s / 2);
      }
    }

    function step() {
      if (!running) return;
      if (keys.current.ArrowUp) player.current.vy = -2.4;
      else if (keys.current.ArrowDown) player.current.vy = 2.4;
      else player.current.vy *= 0.9;
      player.current.y = Math.max(
        20,
        Math.min(H - 50, player.current.y + player.current.vy)
      );

      if (
        !items.current.length ||
        items.current[items.current.length - 1].x < W - 120
      )
        spawn();
      for (const it of items.current) it.x -= it.vx;
      items.current = items.current.filter((it) => it.x > -20);

      for (const it of items.current) {
        const dx = it.x - player.current.x;
        const dy = it.y - player.current.y;
        if (Math.hypot(dx, dy) < (it.type === "recycle" ? 12 : 14)) {
          if (it.type === "recycle") {
            setScore((s) => s + 5);
            setTip(tips[Math.floor(Math.random() * tips.length)]);
            sfx("coin");
          } else {
            sfx("hit");
            gameOver();
            return;
          }
          it.x = -999;
        }
      }

      drawBg();
      drawItems();
      drawPlayer();
      ctx.fillStyle = "#111827";
      ctx.font = "bold 14px ui-sans-serif";
      ctx.fillText(`Tip: ${tip}`, 10, 18);
      raf.current = requestAnimationFrame(step);
    }

    function key(e) {
      keys.current[e.key] = e.type === "keydown";
    }
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", key);

    if (running) {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
      cancelAnimationFrame(raf.current);
    };
  }, [running, tip]);

  useEffect(() => {
    if (!running || over) return;
    if (time <= 0) return gameOver();
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time, over]);

  function start() {
    setScore(0);
    setTime(60);
    setOver(false);
    setShowIntro(false);
    items.current = [];
    keys.current = {};
    player.current = { x: 80, y: H / 2, vy: 0 };
    const ctx = cRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    setRunning(true);
  }

  async function gameOver() {
    setOver(true);
    setRunning(false);
    try {
      await api.post("/games/trash-flight/score", { score });
    } catch {}
  }

  const rules = [
    "Use Arrow Up/Down to steer your glider.",
    "Collect cyan recyclable items (+5).",
    "Avoid red hazards (game over).",
    "You have 60 seconds. Highest score wins!",
  ];

  return (
    <div className="space-y-4">
      <GameHeader title="Trash Flight" score={score} time={time} level={1} />
      <div className="relative w-full max-w-xl">
        <canvas
          ref={cRef}
          width={W}
          height={H}
          className="rounded-lg border border-neutral-800 w-full"
        />
        {showIntro && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <GameIntro
              title="Trash Flight"
              description="Collect recyclables while avoiding hazards. Learn eco-tips as you fly!"
              rules={rules}
              onStart={start}
            />
          </div>
        )}
      </div>
      {over && !showIntro && (
        <div className="text-sm text-neutral-300">
          Great run! Score submitted. Keep recycling!
        </div>
      )}
    </div>
  );
}
