import { Outlet, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../App";

export function Layout() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  function changeLang(lng) {
    i18n.changeLanguage(lng);
  }

  function logout() {
    setUser(null);
    navigate("/");
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-emerald-400">
            {t("appName")}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/leaderboard" className="hover:text-emerald-300">
              {t("leaderboard")}
            </Link>
            {user?.role === "student" && (
              <>
                <Link to="/lessons" className="hover:text-emerald-300">
                  {t("lessons")}
                </Link>
                <Link to="/quizzes" className="hover:text-emerald-300">
                  {t("quizzes")}
                </Link>
                <Link to="/missions" className="hover:text-emerald-300">
                  {t("missions")}
                </Link>
                <Link to="/rewards" className="hover:text-emerald-300">
                  {t("rewards")}
                </Link>
                <Link to="/notifications" className="hover:text-emerald-300">
                  {t("notifications")}
                </Link>
                <Link to="/games" className="hover:text-emerald-300">
                  Games
                </Link>
              </>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeLang("en")}
                className="px-2 py-1 rounded hover:bg-neutral-800"
              >
                EN
              </button>
              <button
                onClick={() => changeLang("hi")}
                className="px-2 py-1 rounded hover:bg-neutral-800"
              >
                हिं
              </button>
              <button
                onClick={() => changeLang("pa")}
                className="px-2 py-1 rounded hover:bg-neutral-800"
              >
                ਪੰ
              </button>
            </div>
            {user ? (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 rounded border border-emerald-600 text-emerald-400 hover:bg-neutral-800"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-neutral-800 text-center py-6 text-xs text-neutral-400">
        © {new Date().getFullYear()} {t("appName")}
      </footer>
    </div>
  );
}
