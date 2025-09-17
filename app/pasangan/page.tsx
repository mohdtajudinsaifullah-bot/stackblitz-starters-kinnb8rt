"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  nama: string | null;
  no_ic: string | null;
  pekerjaan: string | null;
  jabatan: string | null;
  lokasi: string | null;
};

export default function PasanganListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const employeeId = localStorage.getItem("employee_id") || "";
        if (!employeeId) throw new Error("ID pekerja tiada.");
        const { data, error } = await supabase
          .from("pasangan")
          .select("id,nama,no_ic,pekerjaan,jabatan,lokasi")
          .eq("employee_id", employeeId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setRows(data || []);
      } catch (e: any) {
        setErr(e?.message || "Ralat memuatkan data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Senarai Pasangan</h1>
        <button
          onClick={() => router.push("/pasangan/tambah")}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          + Tambah Pasangan
        </button>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Kembali ke Dashboard
      </button>

      {err && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white/70 backdrop-blur">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">No. IC</th>
              <th className="px-3 py-2">Pekerjaan</th>
              <th className="px-3 py-2">Jabatan</th>
              <th className="px-3 py-2">Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-600">
                  Memuatkan...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-600">
                  Tiada maklumat pasangan.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-3 py-2">{r.nama || "—"}</td>
                  <td className="px-3 py-2">{r.no_ic || "—"}</td>
                  <td className="px-3 py-2">{r.pekerjaan || "—"}</td>
                  <td className="px-3 py-2">{r.jabatan || "—"}</td>
                  <td className="px-3 py-2">{r.lokasi || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
