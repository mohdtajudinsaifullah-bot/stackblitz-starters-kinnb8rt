"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TambahSejarahPage() {
  const [tempat, setTempat] = useState("");
  const [jawatan, setJawatan] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("Sila log masuk dahulu.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("sejarah_perkhidmatan").insert([
      {
        user_id: userId,
        tempat,
        jawatan,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setError("Gagal menambah rekod.");
    } else {
      router.push("/sejarah");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">+ Tambah Sejarah Perkhidmatan</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Tempat"
          value={tempat}
          onChange={(e) => setTempat(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="text"
          placeholder="Jawatan"
          value={jawatan}
          onChange={(e) => setJawatan(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={tarikhMula}
            onChange={(e) => setTarikhMula(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
          <input
            type="date"
            value={tarikhTamat}
            onChange={(e) => setTarikhTamat(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan Rekod"}
        </button>
      </form>
    </div>
  );
}
