"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Sejarah {
  id: string;
  jawatan: string;
  lokasi: string;
  tarikh_mula: string;
  tarikh_tamat: string | null;
  created_at: string;
}

export default function SejarahPage() {
  const [sejarah, setSejarah] = useState<Sejarah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSejarah = async () => {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setError("Sila log masuk dahulu.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("user_id", userId)
        .order("tarikh_mula", { ascending: false });

      if (error) {
        setError("Gagal memuatkan sejarah perkhidmatan.");
      } else {
        setSejarah(data || []);
      }
      setLoading(false);
    };

    fetchSejarah();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Anda pasti mahu padam rekod ini?")) return;

    const { error } = await supabase.from("sejarah_perkhidmatan").delete().eq("id", id);

    if (error) {
      alert("Gagal memadam rekod.");
    } else {
      setSejarah((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏢 Sejarah Perkhidmatan</h1>
        <Link
          href="/sejarah/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Rekod
        </Link>
      </div>

      {loading && <p>Memuatkan data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && sejarah.length === 0 && (
        <p className="text-gray-500">Tiada rekod sejarah perkhidmatan.</p>
      )}

      {!loading && sejarah.length > 0 && (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Jawatan</th>
                <th className="px-4 py-2 border">Lokasi</th>
                <th className="px-4 py-2 border">Tempoh</th>
                <th className="px-4 py-2 border">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sejarah.map((s, index) => {
                const tempoh = s.tarikh_tamat
                  ? `${s.tarikh_mula} → ${s.tarikh_tamat}`
                  : `${s.tarikh_mula} → Kini`;

                return (
                  <tr key={s.id} className="text-center hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border font-medium">{s.jawatan}</td>
                    <td className="px-4 py-2 border">{s.lokasi}</td>
                    <td className="px-4 py-2 border">{tempoh}</td>
                    <td className="px-4 py-2 border flex gap-2 justify-center">
                      <Link
                        href={`/sejarah/kemaskini/${s.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Padam
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
