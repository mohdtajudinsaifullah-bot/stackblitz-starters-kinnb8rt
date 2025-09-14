"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Cari email berdasarkan IC
    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("email")
      .eq("no_ic", noIc)
      .maybeSingle();

    if (dbError || !user) {
      setError("No IC tidak dijumpai.");
      setLoading(false);
      return;
    }

    // 2. Login guna email + password ke Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Kata laluan tidak sah.");
    } else {
      router.push("/sejarah"); // redirect ke halaman sejarah
    }
  };

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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {loading ? "Memproses..." : "Log Masuk"}
        </button>
      </form>
    </div>
  );
}
