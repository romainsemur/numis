"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Offer } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

interface OfferWithDetails extends Offer {
  coin: { id: string; name: string; image_url: string | null; is_for_trade: boolean } | null;
  from_user: { username: string } | null;
  to_user: { username: string } | null;
}

type StatusFilter = "all" | "pending" | "accepted" | "refused";

export default function OffersPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [received, setReceived] = useState<OfferWithDetails[]>([]);
  const [sent, setSent] = useState<OfferWithDetails[]>([]);
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadOffers(data.user.id);
      else setLoading(false);
    });
  }, []);

  async function loadOffers(userId: string) {
    const [r, s] = await Promise.all([
      supabase
        .from("offers")
        .select(
          "*, coin:coins(id, name, image_url, is_for_trade), from_user:profiles!offers_from_user_id_fkey(username)"
        )
        .eq("to_user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("offers")
        .select(
          "*, coin:coins(id, name, image_url, is_for_trade), to_user:profiles!offers_to_user_id_fkey(username)"
        )
        .eq("from_user_id", userId)
        .order("created_at", { ascending: false }),
    ]);
    setReceived((r.data as OfferWithDetails[]) || []);
    setSent((s.data as OfferWithDetails[]) || []);
    setLoading(false);
  }

  async function updateOffer(id: string, status: "accepted" | "refused") {
    await supabase.from("offers").update({ status }).eq("id", id);
    if (user) loadOffers(user.id);
  }

  const offers = tab === "received" ? received : sent;

  const filteredOffers = useMemo(() => {
    if (statusFilter === "all") return offers;
    return offers.filter((o) => o.status === statusFilter);
  }, [offers, statusFilter]);

  const pendingReceivedCount = received.filter(
    (o) => o.status === "pending"
  ).length;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    pending: { label: "En attente", bg: "bg-yellow-100", text: "text-yellow-700" },
    accepted: { label: "Acceptee", bg: "bg-green-100", text: "text-green-700" },
    refused: { label: "Refusee", bg: "bg-red-100", text: "text-red-700" },
  };

  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">
          Connectez-vous pour voir vos offres d&apos;echange.
        </p>
        <Link
          href="/auth/login"
          className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Offres d&apos;echange</h1>
        {pendingReceivedCount > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
            {pendingReceivedCount} en attente
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab("received"); setStatusFilter("all"); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "received"
              ? "bg-amber-100 text-amber-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Recues ({received.length})
        </button>
        <button
          onClick={() => { setTab("sent"); setStatusFilter("all"); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "sent"
              ? "bg-amber-100 text-amber-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Envoyees ({sent.length})
        </button>
      </div>

      {/* Status filter */}
      {offers.length > 0 && (
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "accepted", "refused"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s === "all"
                  ? "Toutes"
                  : statusConfig[s].label}
              </button>
            )
          )}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-20">Chargement...</p>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">
            {offers.length === 0
              ? tab === "received"
                ? "Vous n'avez recu aucune offre."
                : "Vous n'avez envoye aucune offre."
              : "Aucune offre avec ce statut."}
          </p>
          {offers.length === 0 && (
            <Link
              href="/collection"
              className="mt-4 inline-block text-sm text-amber-600 hover:underline"
            >
              Parcourir la collection
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOffers.map((offer) => {
            const st = statusConfig[offer.status];
            const otherUser =
              tab === "received"
                ? offer.from_user?.username
                : offer.to_user?.username;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="flex">
                  {/* Coin image */}
                  <Link
                    href={offer.coin ? `/collection/${offer.coin.id}` : "#"}
                    className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center"
                  >
                    {offer.coin?.image_url ? (
                      <img
                        src={offer.coin.image_url}
                        alt={offer.coin.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-gray-300">&#x1FA99;</span>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={
                            offer.coin
                              ? `/collection/${offer.coin.id}`
                              : "#"
                          }
                          className="font-semibold text-gray-900 truncate hover:text-amber-700"
                        >
                          {offer.coin?.name || "Piece supprimee"}
                        </Link>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${st.bg} ${st.text}`}
                        >
                          {st.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {tab === "received" ? "De " : "A "}
                        {otherUser ? (
                          <Link
                            href={`/profile/${otherUser}`}
                            className="text-amber-600 hover:underline"
                          >
                            {otherUser}
                          </Link>
                        ) : (
                          "utilisateur inconnu"
                        )}
                        <span className="mx-1.5 text-gray-300">
                          &middot;
                        </span>
                        <span className="text-gray-400">
                          {formatDate(offer.created_at)}
                        </span>
                      </p>

                      {offer.message && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg italic">
                          {offer.message}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {tab === "received" && offer.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateOffer(offer.id, "accepted")}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => updateOffer(offer.id, "refused")}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
