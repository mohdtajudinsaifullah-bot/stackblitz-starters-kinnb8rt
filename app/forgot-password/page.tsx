"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [noIc, setNoIc] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // 1. Cari email berdasarkan IC
    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("email")
      .eq("no_ic", noIc)
      .maybeSingle();

    if (dbError || !user) {
      setError("No IC tidak wujud dalam sistem.");
      setLoading(false);
      return;
    }

    // 2. Hantar link reset password ke email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError("Gagal hantar pautan reset password.");
    } else {
      setMessage("Pautan reset password telah dihantar ke email anda.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Lupa Kata Laluan</h1>
        <input
          type="text"
          placeholder="Masukkan No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {loading ? "Memproses..." : "Hantar Pautan"}
        </button>
      </form>
    </div>
  );
}
