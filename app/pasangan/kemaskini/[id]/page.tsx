"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function KemaskiniPasangan() {
  const [form, setForm] = useState({
    nama_pasangan: "",
    pekerjaan_pasangan: "",
    jabatan_pasangan: "",
    lokasi_pasangan: ""
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const pasanganId = params?.id as string;

  useEffect(() => {
    if (pasanganId) fetchData();
  }, [pasanganId]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pasangan")
      .select("*")
      .eq("id", pasanganId)
      .single();

    if (!error && data) setForm(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("pasangan")
      .update({
        nama_pasangan: form.nama_pasangan,
        pekerjaan_pasangan: form.pekerjaan_pasangan,
        jabatan_pasangan: form.jabatan_pasangan,
        lokasi_pasangan: form.lokasi_pasangan,
        updated_at: new Date()
      })
      .eq("id", pasanganId);

    if (!error) router.push("/pasangan");
  };

  if (loading) return <p className="text-center p-6">Sedang memuat data...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Kemaskini Pasangan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nama_pasangan" placeholder="Nama Pasangan" value={form.nama_pasangan} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="pekerjaan_pasangan" placeholder="Pekerjaan" value={form.pekerjaan_pasangan} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="jabatan_pasangan" placeholder="Jabatan" value={form.jabatan_pasangan} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="lokasi_pasangan" value={form.lokasi_pasangan} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">-- Pilih Negeri --</option>
          <option value="Johor">Johor</option>
          <option value="Kedah">Kedah</option>
          <option value="Kelantan">Kelantan</option>
          <option value="Melaka">Melaka</option>
          <option value="Negeri Sembilan">Negeri Sembilan</option>
          <option value="Pahang">Pahang</option>
          <option value="Pulau Pinang">Pulau Pinang</option>
          <option value="Perak">Perak</option>
          <option value="Perlis">Perlis</option>
          <option value="Sabah">Sabah</option>
          <option value="Sarawak">Sarawak</option>
          <option value="Selangor">Selangor</option>
          <option value="Terengganu">Terengganu</option>
          <option value="WP Kuala Lumpur">WP Kuala Lumpur</option>
          <option value="WP Labuan">WP Labuan</option>
          <option value="WP Putrajaya">WP Putrajaya</option>
        </select>
        <div className="flex justify-between">
          <button type="button" onClick={() => router.push("/pasangan")} className="bg-gray-500 text-white px-4 py-2 rounded">Batal</button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
        </div>
      </form>
    </div>
  );
}
