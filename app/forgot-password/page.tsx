"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [noIC, setNoIC] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("no_ic", noIC)
      .maybeSingle();

    setLoading(false);

    if (error) {
      setError("Ralat sambungan ke pangkalan data.");
      return;
    }
    if (!data) {
      setError("No IC tidak wujud dalam sistem.");
      return;
    }

    router.push(`/reset-password?user_id=${data.id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Lupa Kata Laluan</h1>
        <input
          type="text"
          value={noIC}
          onChange={(e) => setNoIC(e.target.value)}
          placeholder="Masukkan No IC"
          required
          className="border p-2 w-full rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Mencari..." : "Seterusnya"}
        </button>
      </form>
    </div>
  );
}
