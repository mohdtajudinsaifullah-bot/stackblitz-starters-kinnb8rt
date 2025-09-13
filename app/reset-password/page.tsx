"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [noIc, setNoIc] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("users")
      .update({ password_hash: newPassword })
      .eq("no_ic", noIc);

    if (error) {
      toast.error("Gagal reset kata laluan.");
    } else {
      toast.success("Kata laluan berjaya dikemaskini!");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Reset Kata Laluan</h1>
        <input
          type="text"
          placeholder="Masukkan No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
        />
        <input
          type="password"
          placeholder="Kata Laluan Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded w-full p-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Reset Kata Laluan
        </button>
      </form>
    </div>
  );
}
