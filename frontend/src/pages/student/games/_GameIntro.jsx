export function GameIntro({ title, description, rules = [], onStart }) {
  return (
    <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900 space-y-3">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="text-sm text-neutral-300">{description}</p>
      </div>
      {rules?.length > 0 && (
        <ul className="list-disc ml-5 text-sm text-neutral-300 space-y-1">
          {rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      <button
        onClick={onStart}
        className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
      >
        Start
      </button>
    </div>
  );
}
