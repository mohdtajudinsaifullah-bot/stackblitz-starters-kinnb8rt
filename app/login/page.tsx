"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // login guna dummy email + password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${noIc}@dummy.local`,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error("No IC atau kata laluan salah.");
    } else {
      toast.success("Berjaya log masuk!");
      router.push("/dashboard"); // ✅ Redirect ke dashboard terus
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Log Masuk</h1>

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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sedang log masuk..." : "Log Masuk"}
        </button>

        <div className="flex justify-between text-sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Lupa Kata Laluan?
          </a>
          <a href="/signup" className="text-blue-600 hover:underline">
            Daftar Akaun
          </a>
        </div>
      </form>
    </div>
  );
}
