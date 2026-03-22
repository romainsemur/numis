"use client";

import { useState } from "react";
import type { Coin } from "@/lib/supabase/types";
import Link from "next/link";

interface CoinCardProps {
  coin: Coin;
  showTradeButton?: boolean;
}

export default function CoinCard({ coin, showTradeButton }: CoinCardProps) {
  const [side, setSide] = useState<"obverse" | "reverse">("obverse");
  const imageUrl =
    side === "obverse" ? coin.image_obverse_url : coin.image_reverse_url;
  const hasObverse = !!coin.image_obverse_url;
  const hasReverse = !!coin.image_reverse_url;
  const hasBothSides = hasObverse && hasReverse;

  return (
    <Link
      href={`/collection/${coin.id}`}
      className="card-numis overflow-hidden block"
    >
      <div className="relative aspect-square bg-gold-50 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${coin.name} - ${side === "obverse" ? "Avers" : "Revers"}`}
            className="w-full h-full object-cover"
          />
        ) : hasObverse || hasReverse ? (
          <img
            src={(coin.image_obverse_url || coin.image_reverse_url)!}
            alt={coin.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-brown-200">&#x1FA99;</span>
        )}
        {hasBothSides && (
          <div className="absolute bottom-1.5 right-1.5 flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                setSide("obverse");
              }}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-colors ${
                side === "obverse"
                  ? "bg-gold-500 text-white"
                  : "bg-white/80 text-brown-400 hover:bg-white"
              }`}
            >
              A
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSide("reverse");
              }}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-colors ${
                side === "reverse"
                  ? "bg-gold-500 text-white"
                  : "bg-white/80 text-brown-400 hover:bg-white"
              }`}
            >
              R
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brown-800 truncate">{coin.name}</h3>
        <div className="flex gap-2 mt-1 text-sm text-brown-400">
          {coin.year && <span>{coin.year}</span>}
          {coin.country && <span>{coin.country}</span>}
          {coin.grade && (
            <span className="bg-gold-50 text-gold-700 px-1.5 rounded">{coin.grade}</span>
          )}
        </div>
        {coin.description && (
          <p className="mt-2 text-sm text-brown-300 line-clamp-2">
            {coin.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {coin.is_for_trade && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Disponible
            </span>
          )}
          {showTradeButton && coin.is_for_trade && (
            <span className="text-xs text-gold-600 font-medium">
              Proposer un echange
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
