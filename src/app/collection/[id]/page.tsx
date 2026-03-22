"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Coin, Profile } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOffer, setShowOffer] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    if (!data) {
      setLoading(false);
      return;
    }

    setCoin(data as Coin);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", (data as Coin).user_id)
      .single();

    setOwner(profile as Profile | null);
    setLoading(false);
  }

  async function handleDelete() {
    if (!coin) return;

    if (coin.image_url) {
      const path = coin.image_url.split("/coin-images/")[1];
      if (path) {
        await supabase.storage.from("coin-images").remove([path]);
      }
    }

    const { error } = await supabase.from("coins").delete().eq("id", coin.id);
    if (!error) router.push("/collection");
  }

  async function handleSendOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !coin) return;

    const { error } = await supabase.from("offers").insert({
      coin_id: coin.id,
      from_user_id: user.id,
      to_user_id: coin.user_id,
      message: offerMessage || null,
    });

    if (!error) {
      setOfferSent(true);
      setShowOffer(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Piece introuvable.</p>
        <Link href="/collection" className="text-amber-600 hover:underline">
          Retour a la collection
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === coin.user_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/collection"
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        &larr; Retour a la collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          {coin.image_url ? (
            <img
              src={coin.image_url}
              alt={coin.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl text-gray-300">&#x1FA99;</span>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
            {coin.is_for_trade && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Disponible
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {coin.year && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Annee</span>
                <span className="text-gray-900 font-medium">{coin.year}</span>
              </div>
            )}
            {coin.country && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pays</span>
                <span className="text-gray-900 font-medium">
                  {coin.country}
                </span>
              </div>
            )}
            {coin.grade && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Etat</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-900 text-sm">
                  {coin.grade}
                </span>
              </div>
            )}
          </div>

          {coin.description && (
            <p className="mt-6 text-gray-600 text-sm leading-relaxed">
              {coin.description}
            </p>
          )}

          {owner && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href={`/profile/${owner.username}`}
                className="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                  {owner.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {owner.username}
                  </p>
                  <p className="text-xs text-gray-500">Proprietaire</p>
                </div>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {isOwner ? (
              <>
                <Link
                  href={`/collection/${coin.id}/edit`}
                  className="flex-1 text-center px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Modifier
                </Link>
                {showDeleteConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </>
            ) : coin.is_for_trade && user ? (
              offerSent ? (
                <p className="text-sm text-green-600 font-medium">
                  Offre envoyee !
                </p>
              ) : (
                <button
                  onClick={() => setShowOffer(!showOffer)}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Proposer un echange
                </button>
              )
            ) : null}
          </div>

          {/* Offer form */}
          {showOffer && (
            <form onSubmit={handleSendOffer} className="mt-4 space-y-3">
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Message (optionnel) - decrivez ce que vous proposez en echange..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                >
                  Envoyer l&apos;offre
                </button>
                <button
                  type="button"
                  onClick={() => setShowOffer(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-xs text-gray-400">
            Ajoutee le{" "}
            {new Date(coin.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
