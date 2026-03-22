"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/collection");
      router.refresh();
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Connexion
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Mot de passe"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-amber-600 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
