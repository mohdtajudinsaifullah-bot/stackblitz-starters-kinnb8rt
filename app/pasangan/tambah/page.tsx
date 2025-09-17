"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const NEGERI = [
  "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang",
  "Perak","Perlis","Pulau Pinang","Sabah","Sarawak","Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya",
];

export default function PasanganTambahPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [noIc, setNoIc] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const employeeId = localStorage.getItem("employee_id") || "";
    if (!employeeId) {
      alert("Sesi pengguna tidak sah. Sila log masuk semula.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("pasangan").insert([
      {
        employee_id: employeeId,
        nama,
        no_ic: noIc || null,
        pekerjaan: pekerjaan || null,
        jabatan: jabatan || null,
        lokasi: lokasi || null,
      },
    ]);
    setSaving(false);
    if (error) {
      alert("Gagal simpan pasangan: " + error.message);
      return;
    }
    router.push("/pasangan");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Tambah Pasangan</h1>

      <form onSubmit={onSave} className="space-y-5 rounded-xl border bg-white/70 p-6 backdrop-blur">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">No. IC</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={noIc}
            onChange={(e) => setNoIc(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Pekerjaan</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={pekerjaan}
              onChange={(e) => setPekerjaan(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Jabatan</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Lokasi</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
          >
            <option value="">-- Pilih Lokasi --</option>
            {NEGERI.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/pasangan")}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
