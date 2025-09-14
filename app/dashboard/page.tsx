"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Employee {
  nama: string;
  no_ic: string;
  jawatan_sem: string;
  jabatan: string;
  lokasi: string;
  tarikh_lantikan: string;
}

export default function DashboardPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEmployee();
  }, []);

  async function fetchEmployee() {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Sesi tamat, sila log masuk semula.");
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .select("nama, no_ic, jawatan_sem, jabatan, lokasi, tarikh_lantikan")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) toast.error("Gagal memuatkan maklumat peribadi.");
    else setEmployee(data);

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {loading ? (
        <p>Memuatkan...</p>
      ) : !employee ? (
        <p className="text-red-600">
          Maklumat peribadi tidak dijumpai. Sila hubungi admin.
        </p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Maklumat Peribadi</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nama:</strong> {employee.nama}</p>
            <p><strong>No IC:</strong> {employee.no_ic}</p>
            <p><strong>Jawatan:</strong> {employee.jawatan_sem}</p>
            <p><strong>Jabatan:</strong> {employee.jabatan}</p>
            <p><strong>Lokasi:</strong> {employee.lokasi}</p>
            <p>
              <strong>Tarikh Lantikan:</strong>{" "}
              {new Date(employee.tarikh_lantikan).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/sejarah"
          className="bg-blue-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-blue-700"
        >
          📜 Sejarah Perkhidmatan
        </Link>
        <Link
          href="/kursus"
          className="bg-green-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-green-700"
        >
          🎓 Kursus & Latihan
        </Link>
      </div>
    </div>
  );
}
