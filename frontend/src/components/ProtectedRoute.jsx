import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f9fafb'}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
