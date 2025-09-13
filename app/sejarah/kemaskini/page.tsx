"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function KemaskiniSejarahPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [jawatan, setJawatan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [loading, setLoading] = useState(false);

  // 📌 Fetch data ikut ID
  useEffect(() => {
    if (!id) return;

    async function fetchRecord() {
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Ralat ambil data: " + error.message);
      } else if (data) {
        setJawatan(data.jawatan || "");
        setJabatan(data.jabatan || "");
        setLokasi(data.lokasi || "");
        setTarikhMula(data.tarikh_mula || "");
        setTarikhTamat(data.tarikh_tamat || "");
      }
    }

    fetchRecord();
  }, [id]);

  // 📌 Handle submit update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("sejarah_perkhidmatan")
      .update({
        jawatan,
        jabatan,
        lokasi,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Ralat kemaskini: " + error.message);
    } else {
      alert("Rekod berjaya dikemaskini!");
      router.push("/sejarah");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kemaskini Rekod Sejarah</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Mengemaskini..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
