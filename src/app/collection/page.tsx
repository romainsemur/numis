"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import CoinCard from "@/components/CoinCard";
import ImageUpload from "@/components/ImageUpload";
import type { Coin } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

type SortOption = "recent" | "oldest" | "name" | "year";

export default function CollectionPage() {
  const supabase = createClient();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newObverseUrl, setNewObverseUrl] = useState<string | null>(null);
  const [newReverseUrl, setNewReverseUrl] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterTrade, setFilterTrade] = useState(false);
  const [sort, setSort] = useState<SortOption>("recent");

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

  // Derived unique values for filter dropdowns
  const countries = useMemo(
    () =>
      Array.from(new Set(coins.map((c) => c.country).filter(Boolean))).sort(),
    [coins]
  );
  const grades = useMemo(
    () => Array.from(new Set(coins.map((c) => c.grade).filter(Boolean))),
    [coins]
  );

  // Filtered and sorted coins
  const filteredCoins = useMemo(() => {
    let result = coins;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    if (filterCountry) {
      result = result.filter((c) => c.country === filterCountry);
    }
    if (filterGrade) {
      result = result.filter((c) => c.grade === filterGrade);
    }
    if (filterTrade) {
      result = result.filter((c) => c.is_for_trade);
    }

    switch (sort) {
      case "oldest":
        result = [...result].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "year":
        result = [...result].sort(
          (a, b) => (a.year ?? 0) - (b.year ?? 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [coins, search, filterCountry, filterGrade, filterTrade, sort]);

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
      image_obverse_url: newObverseUrl,
      image_reverse_url: newReverseUrl,
    });

    if (!error) {
      setShowForm(false);
      setNewObverseUrl(null);
      setNewReverseUrl(null);
      loadCoins();
    }
  }

  const hasActiveFilters = search || filterCountry || filterGrade || filterTrade;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
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
          <div className="md:col-span-2 flex gap-4">
            <ImageUpload
              currentUrl={newObverseUrl}
              userId={user?.id ?? ""}
              label="Avers"
              onUploaded={setNewObverseUrl}
            />
            <ImageUpload
              currentUrl={newReverseUrl}
              userId={user?.id ?? ""}
              label="Revers"
              onUploaded={setNewReverseUrl}
            />
          </div>
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

      {/* Search & Filters */}
      {!loading && coins.length > 0 && (
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Rechercher par nom, pays, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700"
            >
              <option value="">Tous les pays</option>
              {countries.map((c) => (
                <option key={c} value={c!}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700"
            >
              <option value="">Tous les etats</option>
              {grades.map((g) => (
                <option key={g} value={g!}>
                  {g}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filterTrade}
                onChange={(e) => setFilterTrade(e.target.checked)}
              />
              A echanger
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 ml-auto"
            >
              <option value="recent">Plus recentes</option>
              <option value="oldest">Plus anciennes</option>
              <option value="name">Nom A-Z</option>
              <option value="year">Annee</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterCountry("");
                  setFilterGrade("");
                  setFilterTrade(false);
                }}
                className="text-xs text-amber-600 hover:underline"
              >
                Reinitialiser
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {filteredCoins.length} piece{filteredCoins.length !== 1 ? "s" : ""}
            {hasActiveFilters ? " (filtrees)" : ""}
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-20">Chargement...</p>
      ) : filteredCoins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">
            {hasActiveFilters
              ? "Aucune piece ne correspond aux filtres."
              : "Aucune piece dans la collection."}
          </p>
          {!hasActiveFilters && !user && (
            <a
              href="/login"
              className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Connectez-vous pour ajouter votre premiere piece
            </a>
          )}
          {!hasActiveFilters && user && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              + Ajouter votre premiere piece
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCoins.map((coin) => (
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
