"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Coin } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";
import ImageUpload from "@/components/ImageUpload";

export default function EditCoinPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [obverseUrl, setObverseUrl] = useState<string | null>(null);
  const [reverseUrl, setReverseUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadCoin();
  }, [id]);

  async function loadCoin() {
    const { data } = await supabase
      .from("coins")
      .select("*")
      .eq("id", id)
      .single();

    const coinData = data as Coin | null;
    setCoin(coinData);
    setObverseUrl(coinData?.image_obverse_url ?? null);
    setReverseUrl(coinData?.image_reverse_url ?? null);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coin || !user) return;
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("coins")
      .update({
        name: form.get("name") as string,
        year: form.get("year") ? Number(form.get("year")) : null,
        country: (form.get("country") as string) || null,
        grade: (form.get("grade") as string) || null,
        description: (form.get("description") as string) || null,
        is_for_trade: form.get("is_for_trade") === "on",
        image_obverse_url: obverseUrl,
        image_reverse_url: reverseUrl,
      })
      .eq("id", coin.id);

    if (!error) {
      router.push(`/collection/${coin.id}`);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!coin || (user && coin.user_id !== user.id)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">
          Piece introuvable ou acces refuse.
        </p>
        <Link href="/collection" className="text-amber-600 hover:underline">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/collection/${coin.id}`}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        &larr; Retour au detail
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Modifier la piece
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            name="name"
            required
            defaultValue={coin.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annee
            </label>
            <input
              name="year"
              type="number"
              defaultValue={coin.year ?? ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pays
            </label>
            <input
              name="country"
              defaultValue={coin.country ?? ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etat de conservation
          </label>
          <select
            name="grade"
            defaultValue={coin.grade ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
          >
            <option value="">Non precise</option>
            <option value="FDC">Fleur de coin (FDC)</option>
            <option value="SPL">Splendide (SPL)</option>
            <option value="SUP">Superbe (SUP)</option>
            <option value="TTB">Tres tres beau (TTB)</option>
            <option value="TB">Tres beau (TB)</option>
            <option value="B">Beau (B)</option>
            <option value="AB">Assez beau (AB)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={coin.description ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-4">
          <ImageUpload
            currentUrl={obverseUrl}
            userId={user?.id ?? ""}
            label="Avers"
            onUploaded={setObverseUrl}
          />
          <ImageUpload
            currentUrl={reverseUrl}
            userId={user?.id ?? ""}
            label="Revers"
            onUploaded={setReverseUrl}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            name="is_for_trade"
            type="checkbox"
            defaultChecked={coin.is_for_trade}
          />
          Disponible pour echange
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link
            href={`/collection/${coin.id}`}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
