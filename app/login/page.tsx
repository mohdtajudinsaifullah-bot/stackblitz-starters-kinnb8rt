"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [noIC, setNoIC] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: noIC, // kalau login guna IC sebagai email
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // ✅ Redirect user selepas login
      router.push("/sejarah"); // atau "/borang" ikut page yang nak
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* input & button sama macam sebelum ni */}
    </form>
  );
}
