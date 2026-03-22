export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Relationships: [];
      };
      coins: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          year: number | null;
          country: string | null;
          grade: string | null;
          image_url: string | null;
          is_for_trade: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          year?: number | null;
          country?: string | null;
          grade?: string | null;
          image_url?: string | null;
          is_for_trade?: boolean;
          description?: string | null;
        };
        Update: {
          name?: string;
          year?: number | null;
          country?: string | null;
          grade?: string | null;
          image_url?: string | null;
          is_for_trade?: boolean;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "coins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          id: string;
          coin_id: string;
          from_user_id: string;
          to_user_id: string;
          message: string | null;
          status: "pending" | "accepted" | "refused";
          created_at: string;
        };
        Insert: {
          id?: string;
          coin_id: string;
          from_user_id: string;
          to_user_id: string;
          message?: string | null;
          status?: "pending" | "accepted" | "refused";
        };
        Update: {
          message?: string | null;
          status?: "pending" | "accepted" | "refused";
        };
        Relationships: [
          {
            foreignKeyName: "offers_coin_id_fkey";
            columns: ["coin_id"];
            isOneToOne: false;
            referencedRelation: "coins";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_from_user_id_fkey";
            columns: ["from_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_to_user_id_fkey";
            columns: ["to_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Coin = Database["public"]["Tables"]["coins"]["Row"];
export type Offer = Database["public"]["Tables"]["offers"]["Row"];
