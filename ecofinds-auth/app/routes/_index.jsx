import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

export function meta() {
  return [
    { title: "EcoFinds" },
    { name: "description", content: "EcoFinds - Discover Amazing Second-Hand Treasures" },
  ];
}

export default function RootRedirect() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // If user is not logged in, redirect to login
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show a simple loading message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
