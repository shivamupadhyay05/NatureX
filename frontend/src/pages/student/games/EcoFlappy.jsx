import { useEffect, useRef, useState } from "react";
import api from "../../../shared/api";
import { GameHeader } from "./_GameHeader";

const WIDTH = 480;
const HEIGHT = 320;
const G = 0.4;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function EcoFlappy() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const bird = useRef({ x: 100, y: 120, vy: 0 });
  const pipes = useRef([]);
  const bgx = useRef(0);
  const raf = useRef(0);
  const spaceHeld = useRef(false);

  useEffect(() => {
    api
      .get("/games/eco-flappy/me")
      .then((r) => setBest(r.data.best?.score || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    function reset() {
      bird.current = { x: 100, y: 120, vy: 0 };
      pipes.current = [];
      bgx.current = 0;
      setScore(0);
      setGameOver(false);
    }

    function addPipe() {
      const gap = 90;
      const top = rand(40, HEIGHT - 120);
      pipes.current.push({ x: WIDTH + 40, top: top, gap: gap, passed: false });
    }

    function drawBackground() {
      bgx.current = (bgx.current - 1.5 + WIDTH) % WIDTH;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(bgx.current - WIDTH, HEIGHT - 40, WIDTH, 40);
      ctx.fillRect(bgx.current, HEIGHT - 40, WIDTH, 40);
      ctx.fillStyle = "#065f46";
      ctx.fillRect(
        ((bgx.current * 1.5) % WIDTH) - WIDTH,
        HEIGHT - 60,
        WIDTH,
        20
      );
      ctx.fillRect((bgx.current * 1.5) % WIDTH, HEIGHT - 60, WIDTH, 20);
    }

    function drawBird() {
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(bird.current.x, bird.current.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(bird.current.x + 8, bird.current.y - 3, 8, 6);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bird.current.x + 4, bird.current.y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(bird.current.x + 5, bird.current.y - 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPipes() {
      ctx.fillStyle = "#16a34a";
      for (const p of pipes.current) {
        ctx.fillRect(p.x, 0, 30, p.top);
        ctx.fillRect(p.x, p.top + p.gap, 30, HEIGHT - (p.top + p.gap));
      }
    }

    function step() {
      if (!running) return;
      bird.current.vy += G;
      bird.current.y += bird.current.vy;
      if (spaceHeld.current) bird.current.vy = -4.2;

      if (
        !pipes.current.length ||
        pipes.current[pipes.current.length - 1].x < WIDTH - 140
      )
        addPipe();
      for (const p of pipes.current) p.x -= 2.2;
      pipes.current = pipes.current.filter((p) => p.x > -40);

      for (const p of pipes.current) {
        if (!p.passed && p.x + 30 < bird.current.x) {
          p.passed = true;
          setScore((s) => s + 1);
        }
      }

      if (bird.current.y < 0 || bird.current.y > HEIGHT) return gameEnd();
      for (const p of pipes.current) {
        if (bird.current.x + 10 > p.x && bird.current.x - 10 < p.x + 30) {
          if (
            bird.current.y - 10 < p.top ||
            bird.current.y + 10 > p.top + p.gap
          )
            return gameEnd();
        }
      }

      drawBackground();
      drawPipes();
      drawBird();
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "bold 16px ui-sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 20);

      raf.current = requestAnimationFrame(step);
    }

    function gameEnd() {
      cancelAnimationFrame(raf.current);
      setRunning(false);
      setGameOver(true);
      api.post("/games/eco-flappy/score", { score }).catch(() => {});
    }

    function handleKey(e) {
      if (e.code === "Space") spaceHeld.current = e.type === "keydown";
    }
    function handleClick() {
      spaceHeld.current = true;
      setTimeout(() => {
        spaceHeld.current = false;
      }, 120);
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    c.addEventListener("mousedown", handleClick);

    if (running) {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
      c.removeEventListener("mousedown", handleClick);
      cancelAnimationFrame(raf.current);
    };
  }, [running, score]);

  function start() {
    // reset positions and start loop
    bird.current = { x: 100, y: 120, vy: 0 };
    pipes.current = [];
    bgx.current = 0;
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }

  return (
    <div className="space-y-4">
      <GameHeader title="Eco Flappy" score={score} level={1} />
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="rounded-lg border border-neutral-800 bg-black w-full max-w-xl"
      />
      <div className="flex gap-2">
        <button
          onClick={start}
          disabled={running}
          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
        >
          {gameOver ? "Restart" : "Start"}
        </button>
        <button
          onMouseDown={() => (spaceHeld.current = true)}
          onMouseUp={() => (spaceHeld.current = false)}
          className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700"
        >
          Flap
        </button>
      </div>
      {gameOver && (
        <div className="text-sm text-neutral-300">
          Game over! Your score was {score}. Try to beat your best: {best}.
        </div>
      )}
    </div>
  );
}
