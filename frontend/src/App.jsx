import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import "./App.css";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { StudentDashboard } from "./pages/student/Dashboard";
import { TeacherDashboard } from "./pages/teacher/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { Leaderboard } from "./pages/common/Leaderboard";
import { Lessons } from "./pages/student/Lessons";
import { Quizzes } from "./pages/student/Quizzes";
import { Missions } from "./pages/student/Missions";
import { Rewards } from "./pages/student/Rewards";
import { Notifications } from "./pages/student/Notifications";
import { LessonViewer } from "./pages/student/LessonViewer";
import { QuizViewer } from "./pages/student/QuizViewer";
import { MissionViewer } from "./pages/student/MissionViewer";
import { Layout } from "./shared/Layout";
export const AuthContext = createContext(null);
export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("nx_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("nx_user", JSON.stringify(user));
    else localStorage.removeItem("nx_user");
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            <Route
              path="student"
              element={
                <RequireAuth roles={["student"]}>
                  <StudentDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="teacher"
              element={
                <RequireAuth roles={["teacher"]}>
                  <TeacherDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="admin"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />

            <Route
              path="lessons"
              element={
                <RequireAuth roles={["student"]}>
                  <Lessons />
                </RequireAuth>
              }
            />
            <Route
              path="lesson/:id"
              element={
                <RequireAuth roles={["student"]}>
                  <LessonViewer />
                </RequireAuth>
              }
            />
            <Route
              path="quizzes"
              element={
                <RequireAuth roles={["student"]}>
                  <Quizzes />
                </RequireAuth>
              }
            />
            <Route
              path="quiz/:id"
              element={
                <RequireAuth roles={["student"]}>
                  <QuizViewer />
                </RequireAuth>
              }
            />
            <Route
              path="missions"
              element={
                <RequireAuth roles={["student"]}>
                  <Missions />
                </RequireAuth>
              }
            />
            <Route
              path="mission/:id"
              element={
                <RequireAuth roles={["student"]}>
                  <MissionViewer />
                </RequireAuth>
              }
            />
            <Route
              path="rewards"
              element={
                <RequireAuth roles={["student"]}>
                  <Rewards />
                </RequireAuth>
              }
            />
            <Route
              path="notifications"
              element={
                <RequireAuth roles={["student"]}>
                  <Notifications />
                </RequireAuth>
              }
            />

            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
