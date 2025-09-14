"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Sejarah {
  id: string;
  jawatan: string;
  lokasi: string;
  tarikh_lantikan: string;
  tarikh_lapor_diri: string;
}

export default function SejarahPage() {
  const [data, setData] = useState<Sejarah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      // Dapatkan user semasa
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Sila log masuk untuk lihat maklumat sejarah perkhidmatan.");
        setLoading(false);
        return;
      }

      // Fetch sejarah_perkhidmatan ikut user_id
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("user_id", user.id)
        .order("tarikh_lantikan", { ascending: true });

      if (error) {
        setError("Ralat memuatkan data.");
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Memuatkan data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sejarah Perkhidmatan</h1>
        <button
          onClick={() => router.push("/sejarah/kemaskini?mode=add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Tambah Rekod Baru
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center">
          Tiada rekod sejarah perkhidmatan.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Jawatan</th>
                <th className="border px-4 py-2 text-left">Lokasi</th>
                <th className="border px-4 py-2 text-left">Tarikh Lantikan</th>
                <th className="border px-4 py-2 text-left">Tarikh Lapor Diri</th>
                <th className="border px-4 py-2 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{row.jawatan}</td>
                  <td className="border px-4 py-2">{row.lokasi}</td>
                  <td className="border px-4 py-2">
                    {row.tarikh_lantikan
                      ? new Date(row.tarikh_lantikan).toLocaleDateString("ms-MY")
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {row.tarikh_lapor_diri
                      ? new Date(row.tarikh_lapor_diri).toLocaleDateString("ms-MY")
                      : "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        router.push(`/sejarah/kemaskini?id=${row.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
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
