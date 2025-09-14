"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function KemaskiniKursusPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama_kursus: "",
    penganjur: "",
    tarikh_mula: "",
    tarikh_tamat: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("kursus_latihan")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) toast.error("Gagal memuatkan data.");
    if (data) {
      setFormData({
        nama_kursus: data.nama_kursus,
        penganjur: data.penganjur,
        tarikh_mula: data.tarikh_mula
          ? new Date(data.tarikh_mula).toISOString().split("T")[0]
          : "",
        tarikh_tamat: data.tarikh_tamat
          ? new Date(data.tarikh_tamat).toISOString().split("T")[0]
          : "",
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Sesi tamat, sila log masuk semula.");
      setLoading(false);
      return;
    }

    let result;
    if (id) {
      result = await supabase.from("kursus_latihan").update(formData).eq("id", id);
    } else {
      result = await supabase.from("kursus_latihan").insert([
        {
          ...formData,
          user_id: user.id,
        },
      ]);
    }

    const { error } = result;
    if (error) toast.error("Gagal menyimpan rekod.");
    else {
      toast.success(id ? "Kursus berjaya dikemaskini!" : "Kursus berjaya ditambah!");
      router.push("/kursus");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          {id ? "Kemaskini Kursus" : "Tambah Kursus Baru"}
        </h1>

        <input
          type="text"
          name="nama_kursus"
          value={formData.nama_kursus}
          onChange={(e) => setFormData({ ...formData, nama_kursus: e.target.value })}
          placeholder="Nama Kursus"
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="penganjur"
          value={formData.penganjur}
          onChange={(e) => setFormData({ ...formData, penganjur: e.target.value })}
          placeholder="Penganjur"
          className="border p-2 w-full rounded"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Tarikh Mula</label>
            <input
              type="date"
              name="tarikh_mula"
              value={formData.tarikh_mula}
              onChange={(e) => setFormData({ ...formData, tarikh_mula: e.target.value })}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Tarikh Tamat</label>
            <input
              type="date"
              name="tarikh_tamat"
              value={formData.tarikh_tamat}
              onChange={(e) => setFormData({ ...formData, tarikh_tamat: e.target.value })}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/kursus")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
