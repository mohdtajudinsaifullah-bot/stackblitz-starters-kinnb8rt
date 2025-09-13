"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TambahSejarahPage() {
  const [jawatan, setJawatan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("sejarah_perkhidmatan").insert([
      {
        jawatan,
        jabatan,
        lokasi,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Ralat: " + error.message);
    } else {
      alert("Rekod berjaya ditambah!");
      router.push("/sejarah");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Rekod Sejarah</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">Jawatan</label>
          <input
            type="text"
            value={jawatan}
            onChange={(e) => setJawatan(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Jabatan</label>
          <input
            type="text"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Lokasi</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Tarikh Mula</label>
          <input
            type="date"
            value={tarikhMula}
            onChange={(e) => setTarikhMula(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Tarikh Tamat</label>
          <input
            type="date"
            value={tarikhTamat}
            onChange={(e) => setTarikhTamat(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Menyimpan..." : "Simpan Rekod"}
        </button>
      </form>
    </div>
  );
}
