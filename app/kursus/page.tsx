"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Kursus {
  id: string;
  nama: string;
  lokasi: string | null;
  tarikh_mula: string;
  tarikh_tamat: string | null;
  created_at: string;
}

export default function KursusPage() {
  const [kursus, setKursus] = useState<Kursus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKursus = async () => {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setError("Sila log masuk dahulu.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("kursus")
        .select("*")
        .eq("user_id", userId)
        .order("tarikh_mula", { ascending: false });

      if (error) {
        setError("Gagal memuatkan kursus.");
      } else {
        setKursus(data || []);
      }
      setLoading(false);
    };

    fetchKursus();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Anda pasti mahu padam kursus ini?")) return;

    const { error } = await supabase.from("kursus").delete().eq("id", id);

    if (error) {
      alert("Gagal memadam kursus.");
    } else {
      setKursus((prev) => prev.filter((k) => k.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Senarai Kursus</h1>
        <Link
          href="/kursus/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Kursus
        </Link>
      </div>

      {loading && <p>Memuatkan data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && kursus.length === 0 && (
        <p className="text-gray-500">Tiada kursus direkodkan.</p>
      )}

      {!loading && kursus.length > 0 && (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Nama Kursus</th>
                <th className="px-4 py-2 border">Lokasi</th>
                <th className="px-4 py-2 border">Tarikh</th>
                <th className="px-4 py-2 border">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {kursus.map((k, index) => (
                <tr key={k.id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border font-medium">{k.nama}</td>
                  <td className="px-4 py-2 border">{k.lokasi || "-"}</td>
                  <td className="px-4 py-2 border">
                    {k.tarikh_mula}{" "}
                    {k.tarikh_tamat ? ` → ${k.tarikh_tamat}` : ""}
                  </td>
                  <td className="px-4 py-2 border flex gap-2 justify-center">
                    <Link
                      href={`/kursus/kemaskini/${k.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Padam
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
