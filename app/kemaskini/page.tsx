"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function KemaskiniMaklumat() {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) console.error(error);
        setEmployee(data);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("employees")
      .update({
        alamat_tempat_tinggal: employee.alamat_tempat_tinggal,
        jawatan_sem: employee.jawatan_sem,
        jabatan: employee.jabatan,
        lokasi: employee.lokasi,
        tarikh_lapor_diri: employee.tarikh_lapor_diri,
        nama_pasangan: employee.nama_pasangan,
        pekerjaan_pasangan: employee.pekerjaan_pasangan,
        jabatan_pasangan: employee.jabatan_pasangan,
        lokasi_pasangan: employee.lokasi_pasangan,
      })
      .eq("id", employee.id);

    if (error) {
      alert("Gagal kemaskini: " + error.message);
    } else {
      alert("Maklumat berjaya dikemaskini!");
      router.push("/profile");
    }
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>Tiada data ditemui</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-3">
      <h1 className="text-xl font-bold mb-4">Kemaskini Maklumat Peribadi</h1>

      <div>
        <label>Alamat:</label>
        <input
          type="text"
          value={employee.alamat_tempat_tinggal || ""}
          onChange={(e) =>
            setEmployee({ ...employee, alamat_tempat_tinggal: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Jawatan Semasa:</label>
        <input
          type="text"
          value={employee.jawatan_sem || ""}
          onChange={(e) =>
            setEmployee({ ...employee, jawatan_sem: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Jabatan:</label>
        <input
          type="text"
          value={employee.jabatan || ""}
          onChange={(e) =>
            setEmployee({ ...employee, jabatan: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Lokasi:</label>
        <input
          type="text"
          value={employee.lokasi || ""}
          onChange={(e) =>
            setEmployee({ ...employee, lokasi: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Tarikh Lapor Diri:</label>
        <input
          type="date"
          value={employee.tarikh_lapor_diri || ""}
          onChange={(e) =>
            setEmployee({ ...employee, tarikh_lapor_diri: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <h2 className="font-bold mt-4">Maklumat Pasangan</h2>
      <div>
        <label>Nama Pasangan:</label>
        <input
          type="text"
          value={employee.nama_pasangan || ""}
          onChange={(e) =>
            setEmployee({ ...employee, nama_pasangan: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Pekerjaan Pasangan:</label>
        <input
          type="text"
          value={employee.pekerjaan_pasangan || ""}
          onChange={(e) =>
            setEmployee({ ...employee, pekerjaan_pasangan: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Jabatan Pasangan:</label>
        <input
          type="text"
          value={employee.jabatan_pasangan || ""}
          onChange={(e) =>
            setEmployee({ ...employee, jabatan_pasangan: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Lokasi Pasangan:</label>
        <input
          type="text"
          value={employee.lokasi_pasangan || ""}
          onChange={(e) =>
            setEmployee({ ...employee, lokasi_pasangan: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
