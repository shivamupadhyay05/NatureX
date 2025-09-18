export function GameHeader({ title, score, time, level }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-800 p-3 bg-neutral-900">
      <div className="font-semibold">{title}</div>
      <div className="flex items-center gap-4 text-sm">
        <div>
          Level: <span className="font-medium">{level}</span>
        </div>
        <div>
          Score: <span className="font-medium">{score}</span>
        </div>
        {typeof time === "number" && (
          <div>
            Time: <span className="font-medium">{time}s</span>
          </div>
        )}
      </div>
    </div>
  );
}
