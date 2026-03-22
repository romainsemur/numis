# Numis - Collection de pieces de monnaie

Application web pour gerer, partager et echanger des pieces de monnaie entre collectionneurs.

## Stack

- **Next.js** (App Router) + TypeScript
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS**
- **Vercel** (deploiement)

## Demarrage

```bash
npm install
cp .env.local.example .env.local
# Remplir les variables Supabase dans .env.local
npm run dev
```

## Base de donnees

Executer le fichier `supabase/schema.sql` dans l'editeur SQL de Supabase pour creer les tables.

## Structure

```
src/
  app/
    page.tsx              # Page d'accueil
    collection/page.tsx   # Liste des pieces + ajout
    profile/[username]/   # Profil public d'un collectionneur
    offers/page.tsx       # Systeme d'offres d'echange
    auth/login/           # Connexion
    auth/register/        # Inscription
  components/
    Navbar.tsx            # Navigation
    CoinCard.tsx          # Carte d'une piece
  lib/supabase/
    client.ts             # Client Supabase (navigateur)
    server.ts             # Client Supabase (serveur)
    types.ts              # Types TypeScript de la BDD
  middleware.ts           # Refresh session Supabase
supabase/
  schema.sql              # Schema SQL complet avec RLS
```
