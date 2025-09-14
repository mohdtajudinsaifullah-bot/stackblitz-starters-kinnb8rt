"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import toast from "react-hot-toast";

interface Kursus {
  id: string;
  nama_kursus: string;
  penganjur: string;
  tarikh_mula: string;
  tarikh_tamat: string;
}

export default function KursusPage() {
  const [kursus, setKursus] = useState<Kursus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKursus();
  }, []);

  async function fetchKursus() {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Sesi anda telah tamat, sila log masuk semula.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("kursus_latihan")
      .select("*")
      .eq("user_id", user.id)
      .order("tarikh_mula", { ascending: false });

    if (error) toast.error("Gagal memuatkan data kursus.");
    else setKursus(data || []);

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kursus & Latihan</h1>
        <Link
          href="/kursus/kemaskini?mode=add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah Kursus
        </Link>
      </div>

      {loading ? (
        <p>Memuatkan...</p>
      ) : kursus.length === 0 ? (
        <p className="text-gray-500">Tiada rekod kursus.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Nama Kursus</th>
              <th className="p-3">Penganjur</th>
              <th className="p-3">Tarikh</th>
              <th className="p-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {kursus.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.nama_kursus}</td>
                <td className="p-3">{item.penganjur}</td>
                <td className="p-3">
                  {new Date(item.tarikh_mula).toLocaleDateString()} -{" "}
                  {new Date(item.tarikh_tamat).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/kursus/kemaskini?id=${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
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
