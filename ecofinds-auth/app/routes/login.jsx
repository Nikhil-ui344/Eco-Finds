import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";
import logo from "../welcome/EcoFinder.png";

export function meta() {
  return [
    { title: "Login | EcoFinds" },
    { name: "description", content: "Login to EcoFinds" },
  ];
}

export default function Login() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) nav("/");
  }, [authLoading, user, nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isFirebaseReady) {
      setError("App not configured. Add your Firebase keys to .env and reload.");
      return;
    }
    if (!email || !password) {
      setError("Email/Username and Password are required");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/");
    } catch (err) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex flex-col items-center gap-5 mb-4">
              <div className="flex flex-col items-center gap-0">
                <img src={logo} alt="EcoFinds" className="block w-20 h-20" />
                <div className="text-xl font-semibold eco-ring-2 leading-none -mt-3">  EcoFinds</div>
              </div>
              <h1 className="text-3xl font-semibold eco-ring-3">Login</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full eco-btn rounded py-2 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          </form>
          <p className="text-sm mt-4 text-center">
            New here? <a href="/signup" className="eco-link underline">Create an account</a>
          </p>
        </div>
      </div>
    </main>
  );
}
