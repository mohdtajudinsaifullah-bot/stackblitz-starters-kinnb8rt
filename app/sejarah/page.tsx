"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SejarahPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .order("tarikh_mula", { ascending: true });

      if (error) console.error("Fetch error:", error);
      else setRecords(data || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sejarah Perkhidmatan</h1>

      {/* 🔹 Butang tambah rekod baru */}
      <div className="mb-4">
        <Link
          href="/sejarah/tambah"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Tambah Rekod Baru
        </Link>
      </div>

      {records.length === 0 ? (
        <p>Tiada rekod ditemui.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Jawatan</th>
              <th className="border px-4 py-2">Jabatan</th>
              <th className="border px-4 py-2">Lokasi</th>
              <th className="border px-4 py-2">Tarikh Mula</th>
              <th className="border px-4 py-2">Tarikh Tamat</th>
              <th className="border px-4 py-2">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td className="border px-4 py-2">{rec.jawatan}</td>
                <td className="border px-4 py-2">{rec.jabatan}</td>
                <td className="border px-4 py-2">{rec.lokasi}</td>
                <td className="border px-4 py-2">{rec.tarikh_mula}</td>
                <td className="border px-4 py-2">{rec.tarikh_tamat}</td>
                <td className="border px-4 py-2">
                  <Link
                    href={`/sejarah/kemaskini?id=${rec.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Kemaskini
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
