import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";
import { useNavigate } from "react-router";
import logo from "../welcome/EcoFinder.png";

export function meta() {
  return [
    { title: "Sign up | EcoFinds" },
    { name: "description", content: "Create an EcoFinds account" },
  ];
}

export default function Signup() {
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isFirebaseReady) {
      setError("App not configured. Add your Firebase keys to .env and reload.");
      return;
    }
    if (!displayName) return setError("Display Name is required");
    if (!email) return setError("Email is required");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName });
      }
      nav("/dashboard");
    } catch (err) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <img src={logo} alt="EcoFinds" className="w-16 h-16" />
            <h1 className="text-3xl font-semibold eco-ring-3">Sign up</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded px-3 py-2"
              autoComplete="new-password"
              required
            />
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full eco-btn rounded py-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          </form>
          <p className="text-sm mt-4 text-center">
            Already have an account? {" "}
            <a href="/login" className="eco-link underline">Login</a>
          </p>
        </div>
      </div>
    </main>
  );
}
