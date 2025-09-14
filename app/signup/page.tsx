"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [noIc, setNoIc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    // Daftar ke Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      toast.error("Gagal daftar akaun ke Supabase Auth.");
      return;
    }

    // Simpan ke table users
    const { error: dbError } = await supabase.from("users").insert([
      {
        no_ic: noIc,
        email,
        role: "staff",
      },
    ]);

    if (dbError) {
      toast.error("Gagal simpan data user ke DB.");
    } else {
      toast.success("Akaun berjaya didaftarkan!");
      router.push("/login");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Daftar Akaun Baru</h1>
        <input
          type="text"
          placeholder="No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
        />
        <input
          type="email"
          placeholder="Email Sebenar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2"
        />
        <input
          type="password"
          placeholder="Kata Laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Daftar Akaun
        </button>
      </form>
    </div>
  );
}
