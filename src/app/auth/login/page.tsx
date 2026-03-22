"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import GoogleButton from "@/components/GoogleButton";

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
      <div className="flex justify-center mb-6">
        <Logo size={56} />
      </div>
      <h1 className="text-2xl font-bold text-brown-800 mb-6 text-center">
        Connexion
      </h1>

      <GoogleButton />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brown-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-brown-400">ou par email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-2.5 border border-brown-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Mot de passe"
          className="w-full px-4 py-2.5 border border-brown-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 btn-gold rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brown-400">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-gold-600 hover:underline font-medium">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
