"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: form.get("email") as string,
      password: form.get("password") as string,
      options: {
        data: {
          username: form.get("username") as string,
        },
      },
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
        Creer un compte
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          required
          placeholder="Nom d'utilisateur"
          className="w-full px-4 py-2.5 border border-brown-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
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
          minLength={6}
          placeholder="Mot de passe (6 caracteres min.)"
          className="w-full px-4 py-2.5 border border-brown-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 btn-gold rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Creation..." : "S&apos;inscrire"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brown-400">
        Deja un compte ?{" "}
        <Link href="/auth/login" className="text-gold-600 hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
