"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FormPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
        }
      }
    }
    getUserProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      phone: phone,
    });

    if (error) {
      alert("Gagal kemaskini: " + error.message);
    } else {
      alert("Maklumat berjaya dikemaskini!");
    }
  }

  if (!user) return <p>Sila log masuk dahulu.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kemaskini Borang</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Nama Penuh</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">No. Telefon</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
