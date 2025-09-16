"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function KemaskiniKursusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data, error } = await supabase
        .from("kursus")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setError("Rekod tidak dijumpai.");
        return;
      }

      setNama(data.nama);
      setLokasi(data.lokasi);
      setTarikhMula(data.tarikh_mula);
      setTarikhTamat(data.tarikh_tamat || "");
    })();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase
      .from("kursus")
      .update({
        nama,
        lokasi,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat || null,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError("Gagal mengemaskini kursus.");
    } else {
      router.push("/kursus");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">✏️ Kemaskini Kursus</h1>
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
          className="bg-yellow-600 text-white w-full p-2 rounded hover:bg-yellow-700"
        >
          {loading ? "Mengemaskini..." : "Kemaskini Kursus"}
        </button>
      </form>
    </div>
  );
}
