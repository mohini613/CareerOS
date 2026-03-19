import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dashboard from "./Dashboard";
import JobApplications from "./JobApplications";
import Goals from "./Goals";
import Resumes from "./Resumes";
import AIAnalyzer from "./AIAnalyzer";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "../components/ProtectedRoute";

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };
  return (
    <>
      <style>{`* { margin:0; padding:0; box-sizing:border-box; } body { background:#0C0C14; color:#F0EDE8; }`}</style>
      <Navbar activePath={location.pathname} onNavigate={(path) => navigate(path)} onLogout={handleLogout} user={user} />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index                element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/applications" element={<JobApplications />} />
            <Route path="/goals"        element={<Goals />} />
            <Route path="/resumes"      element={<Resumes />} />
            <Route path="/analyzer"     element={<AIAnalyzer />} />
            <Route path="/profile"      element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
