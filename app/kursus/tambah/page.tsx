"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TambahKursusPage() {
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
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

    const { error } = await supabase.from("kursus").insert([
      {
        user_id: userId,
        nama,
        lokasi,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setError("Gagal menambah kursus.");
    } else {
      router.push("/kursus");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">+ Tambah Kursus</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Nama Kursus"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="text"
          placeholder="Lokasi"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="border rounded w-full p-2"
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
          {loading ? "Menyimpan..." : "Simpan Kursus"}
        </button>
      </form>
    </div>
  );
}
