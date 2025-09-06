import { useAuth } from "../lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";

export function meta() {
  return [
    { title: "Dashboard | EcoFinds" },
    { name: "description", content: "User dashboard" },
  ];
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [loading, user, nav]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user || !isFirebaseReady) return null;

  return (
    <main className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-semibold eco-ring-3">Welcome, {user.displayName || user.email}</h1>
      <p className="text-sm text-gray-700">You are logged in.</p>
      <div>
        <a href="/" className="eco-link underline mr-4">Home</a>
        <button
          className="px-3 py-2 rounded eco-btn"
          onClick={() => isFirebaseReady && signOut(auth).then(() => nav("/login"))}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
