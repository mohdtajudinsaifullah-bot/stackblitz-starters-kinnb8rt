"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("no_ic", noIc)
      .single();

    if (error || !data) {
      toast.error("No IC tidak dijumpai.");
      return;
    }

    if (data.password_hash !== password) {
      toast.error("Kata laluan salah.");
      return;
    }

    toast.success("Log masuk berjaya!");
    router.push("/profile");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Log Masuk</h1>
        <input
          type="text"
          placeholder="No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
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
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Log Masuk
        </button>

        <p className="text-center text-sm">
          <a href="/reset-password" className="text-blue-600">
            Lupa Kata Laluan?
          </a>
        </p>
        <p className="text-center text-sm">
          Belum ada akaun?{" "}
          <a href="/signup" className="text-blue-600">
            Daftar Akaun Baru
          </a>
        </p>
      </form>
    </div>
  );
}
