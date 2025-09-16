"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("🟢 Try login with:", { noIc, password });

    const { data: user, error } = await supabase
      .from("users")
      .select("id, no_ic, password_hash")
      .eq("no_ic", noIc.trim())
      .eq("password_hash", password.trim())
      .maybeSingle();

    console.log("🔵 Supabase response:", { user, error });

    if (error || !user) {
      console.error("❌ Login failed:", error);
      setError("No IC atau Kata Laluan salah.");
      return;
    }

    console.log("✅ Login success, redirecting...", user);

    localStorage.setItem("user_id", user.id);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Log Masuk</h1>
        <input
          type="text"
          placeholder="No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="password"
          placeholder="Kata Laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Log Masuk
        </button>
        <div className="flex justify-between text-sm">
          <a href="/signup" className="text-green-600 hover:underline">
            Daftar Baru
          </a>
          <a href="/reset-password" className="text-blue-600 hover:underline">
            Lupa Password?
          </a>
        </div>
      </form>
    </div>
  );
}
