"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [noIC, setNoIC] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cuba login guna Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: noIC, // Pastikan noIC memang simpan dalam email semasa daftar
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // ✅ Redirect selepas login berjaya
      router.push("/sejarah"); // tukar ke "/form" kalau nak bawa user ke borang
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log Masuk</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="No IC"
            value={noIC}
            onChange={(e) => setNoIC(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Kata Laluan"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log Masuk
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Lupa Kata Laluan?
          </a>
          <a href="/signup" className="text-blue-500 hover:underline">
            Daftar Akaun Baru
          </a>
        </div>
      </div>
    </div>
  );
}
