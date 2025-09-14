"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function KemaskiniSejarahPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode"); // mode=add untuk tambah baru
  const router = useRouter();

  const [formData, setFormData] = useState({
    jawatan: "",
    lokasi: "",
    tarikh_lantikan: "",
    tarikh_lapor_diri: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch data jika dalam mod edit
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("sejarah_perkhidmatan")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          toast.error("Gagal memuatkan data.");
        } else if (data) {
          setFormData({
            jawatan: data.jawatan || "",
            lokasi: data.lokasi || "",
            tarikh_lantikan: data.tarikh_lantikan
              ? new Date(data.tarikh_lantikan).toISOString().split("T")[0]
              : "",
            tarikh_lapor_diri: data.tarikh_lapor_diri
              ? new Date(data.tarikh_lapor_diri).toISOString().split("T")[0]
              : "",
          });
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Dapatkan user semasa
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Sesi log masuk tamat. Sila log masuk semula.");
      setLoading(false);
      return;
    }

    let result;
    if (id) {
      // UPDATE
      result = await supabase
        .from("sejarah_perkhidmatan")
        .update({
          jawatan: formData.jawatan,
          lokasi: formData.lokasi,
          tarikh_lantikan: formData.tarikh_lantikan,
          tarikh_lapor_diri: formData.tarikh_lapor_diri,
        })
        .eq("id", id);
    } else {
      // INSERT
      result = await supabase.from("sejarah_perkhidmatan").insert([
        {
          user_id: user.id,
          jawatan: formData.jawatan,
          lokasi: formData.lokasi,
          tarikh_lantikan: formData.tarikh_lantikan,
          tarikh_lapor_diri: formData.tarikh_lapor_diri,
        },
      ]);
    }

    const { error } = result;

    if (error) {
      toast.error("Gagal menyimpan rekod.");
    } else {
      toast.success(id ? "Rekod berjaya dikemaskini!" : "Rekod berjaya ditambah!");
      router.push("/sejarah");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          {id ? "Kemaskini Sejarah Perkhidmatan" : "Tambah Rekod Baru"}
        </h1>

        <input
          type="text"
          name="jawatan"
          value={formData.jawatan}
          onChange={handleChange}
          placeholder="Jawatan"
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="lokasi"
          value={formData.lokasi}
          onChange={handleChange}
          placeholder="Lokasi"
          required
          className="border p-2 w-full rounded"
        />
        <label className="block text-sm text-gray-700">Tarikh Lantikan</label>
        <input
          type="date"
          name="tarikh_lantikan"
          value={formData.tarikh_lantikan}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <label className="block text-sm text-gray-700">Tarikh Lapor Diri</label>
        <input
          type="date"
          name="tarikh_lapor_diri"
          value={formData.tarikh_lapor_diri}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.push("/sejarah")}
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
