"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CoinCard from "@/components/CoinCard";
import type { Coin } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

export default function CollectionPage() {
  const supabase = createClient();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadCoins();
  }, []);

  async function loadCoins() {
    const { data } = await supabase
      .from("coins")
      .select("*")
      .order("created_at", { ascending: false });
    setCoins((data as Coin[]) || []);
    setLoading(false);
  }

  async function handleAddCoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from("coins").insert({
      user_id: user.id,
      name: form.get("name") as string,
      year: form.get("year") ? Number(form.get("year")) : null,
      country: (form.get("country") as string) || null,
      grade: (form.get("grade") as string) || null,
      description: (form.get("description") as string) || null,
      is_for_trade: form.get("is_for_trade") === "on",
    });

    if (!error) {
      setShowForm(false);
      loadCoins();
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collection</h1>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            {showForm ? "Annuler" : "+ Ajouter une piece"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleAddCoin}
          className="mb-8 p-6 bg-white rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            required
            placeholder="Nom de la piece *"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            name="year"
            type="number"
            placeholder="Annee"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            name="country"
            placeholder="Pays"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            name="grade"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
          >
            <option value="">Etat de conservation</option>
            <option value="FDC">Fleur de coin (FDC)</option>
            <option value="SPL">Splendide (SPL)</option>
            <option value="SUP">Superbe (SUP)</option>
            <option value="TTB">Tres tres beau (TTB)</option>
            <option value="TB">Tres beau (TB)</option>
            <option value="B">Beau (B)</option>
            <option value="AB">Assez beau (AB)</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input name="is_for_trade" type="checkbox" />
            Disponible pour echange
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-20">Chargement...</p>
      ) : coins.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          Aucune piece dans la collection.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              showTradeButton={user?.id !== coin.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
