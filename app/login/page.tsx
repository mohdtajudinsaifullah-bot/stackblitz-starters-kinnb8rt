"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, no_ic, password_hash")
      .eq("no_ic", noIc)
      .maybeSingle();

    setLoading(false);

    if (error) {
      toast.error("Ralat sambungan ke pangkalan data.");
      return;
    }
    if (!user) {
      toast.error("No IC tidak wujud dalam sistem.");
      return;
    }
    if (user.password_hash !== password) {
      toast.error("Kata laluan salah.");
      return;
    }

    toast.success("Berjaya log masuk!");
    router.push("/profile");
  };

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
          required
        />
        <input
          type="password"
          placeholder="Kata Laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sedang log masuk..." : "Log Masuk"}
        </button>

        <div className="flex justify-between text-sm text-blue-600">
          <Link href="/forgot-password" className="hover:underline">
            Lupa Kata Laluan?
          </Link>
          <Link href="/signup" className="hover:underline">
            Daftar Akaun Baru
          </Link>
        </div>
      </form>
    </div>
  );
}
