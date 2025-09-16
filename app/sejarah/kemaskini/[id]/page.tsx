"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function KemaskiniSejarahPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tempat, setTempat] = useState("");
  const [jawatan, setJawatan] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setError("Rekod tidak dijumpai.");
        return;
      }

      setTempat(data.tempat);
      setJawatan(data.jawatan);
      setTarikhMula(data.tarikh_mula);
      setTarikhTamat(data.tarikh_tamat || "");
    })();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase
      .from("sejarah_perkhidmatan")
      .update({
        tempat,
        jawatan,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat || null,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError("Gagal mengemaskini rekod.");
    } else {
      router.push("/sejarah");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">✏️ Kemaskini Sejarah Perkhidmatan</h1>
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
          className="bg-yellow-600 text-white w-full p-2 rounded hover:bg-yellow-700"
        >
          {loading ? "Mengemaskini..." : "Kemaskini Rekod"}
        </button>
      </form>
    </div>
  );
}
