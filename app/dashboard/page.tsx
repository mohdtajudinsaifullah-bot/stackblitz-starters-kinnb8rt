"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Employee = {
  nama: string | null;
  no_ic: string | null;
  emel: string | null;
  jawatan_sem: string | null;
  jabatan_sem: string | null;
  lokasi: string | null;
  gambar_url?: string | null;
};

export default function DashboardPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("employees")
        .select("nama, no_ic, emel, jawatan_sem, jabatan_sem, lokasi, gambar_url")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) setEmployee(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Memuatkan maklumat peribadi…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Dashboard Sistem e-Perkhidmatan
      </h1>

      {/* Card Maklumat Peribadi */}
      <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-6">
        <div>
          {employee?.gambar_url ? (
            <img
              src={employee.gambar_url}
              alt="Gambar Profil"
              className="w-28 h-28 object-cover rounded-full border"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-xl">
              👤
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-lg font-bold">{employee?.nama || "Tidak Dikenal Pasti"}</p>
          <p className="text-sm text-gray-600">IC: {employee?.no_ic}</p>
          <p className="text-sm text-gray-600">Emel: {employee?.emel}</p>
          <p className="text-sm text-gray-600">Jawatan: {employee?.jawatan_sem}</p>
          <p className="text-sm text-gray-600">Jabatan: {employee?.jabatan_sem}</p>
          <p className="text-sm text-gray-600">Lokasi: {employee?.lokasi}</p>
        </div>
        <Link
          href="/form"
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          Kemaskini Profil
        </Link>
      </div>

      {/* Menu Navigasi */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/sejarah"
          className="p-6 bg-blue-600 text-white rounded-xl text-center text-lg font-semibold shadow hover:bg-blue-700"
        >
          📜 Sejarah Perkhidmatan
        </Link>
        <Link
          href="/kursus"
          className="p-6 bg-green-600 text-white rounded-xl text-center text-lg font-semibold shadow hover:bg-green-700"
        >
          🎓 Kursus / Latihan
        </Link>
      </div>
    </div>
  );
}
