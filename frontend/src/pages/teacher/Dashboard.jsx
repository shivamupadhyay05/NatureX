import { useEffect, useState } from "react";
import api from "../../shared/api";

export function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [d, a] = await Promise.all([
          api.get("/teacher/dashboard"),
          api.get("/teacher/alerts"),
        ]);
        if (mounted) {
          setData(d.data);
          setAlerts(a.data);
        }
      } catch (e) {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function bonusXp(studentId) {
    await api.post("/teacher/bonus-xp", {
      studentId,
      amount: 10,
      reason: "Effort",
    });
    alert("Bonus XP awarded");
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="text-xs text-neutral-400">Active Classes</div>
          <div className="text-2xl font-bold">{data.classes}</div>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="text-xs text-neutral-400">Students</div>
          <div className="text-2xl font-bold">{data.students}</div>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="text-xs text-neutral-400">Assignments</div>
          <div className="text-2xl font-bold">{data.assignments}</div>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <div className="text-xs text-neutral-400">Avg XP</div>
          <div className="text-2xl font-bold">{data.avgXp}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <h3 className="font-semibold mb-2">Quick Alerts</h3>
          <div className="text-sm text-neutral-400 mb-1">
            Inactive students (7+ days)
          </div>
          <ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
            {alerts?.inactive?.slice(0, 6).map((s) => (
              <li key={s.id}>
                {s.name}{" "}
                <button
                  onClick={() => bonusXp(s.id)}
                  className="ml-2 text-emerald-400 underline"
                >
                  Give +10 XP
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
          <h3 className="font-semibold mb-2">Low Performers</h3>
          <ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
            {alerts?.lowPerformers?.slice(0, 6).map((s) => (
              <li key={s.id}>
                {s.name} — XP {s.xp}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
        <h3 className="font-semibold mb-2">Recent Submissions</h3>
        {data.recentSubmissions?.length ? (
          <ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
            {data.recentSubmissions.map((s) => (
              <li key={s.id}>
                {new Date(s.createdAt).toLocaleString()} — {s.status}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-neutral-400 text-sm">No recent submissions</div>
        )}
      </div>
    </div>
  );
}
