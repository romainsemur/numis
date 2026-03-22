# Protocole de mise en ligne - Numis

Guide complet pour deployer Numis sur internet, de zero a un site fonctionnel.

---

## Prerequis

- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Un compte [Google Cloud](https://console.cloud.google.com) (gratuit, uniquement pour l'auth Google)

---

## Etape 1 — Creer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et se connecter
2. Cliquer sur **New Project**
3. Choisir un nom (ex: `numis`), un mot de passe pour la base de donnees, et la region la plus proche
4. Attendre que le projet soit provisionne (~2 minutes)

### Recuperer les cles API

5. Aller dans **Settings** > **API**
6. Noter les deux valeurs suivantes :
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJhbGciOi...`

---

## Etape 2 — Creer les tables et le storage

### Tables et politiques RLS

1. Aller dans **SQL Editor** (menu de gauche)
2. Cliquer sur **New Query**
3. Copier-coller l'integralite du fichier `supabase/schema.sql`
4. Cliquer sur **Run** (ou Ctrl+Enter)
5. Verifier que le message indique "Success. No rows returned" pour chaque instruction

### Verifier les tables

6. Aller dans **Table Editor** (menu de gauche)
7. Confirmer la presence des tables : `profiles`, `coins`, `offers`

### Verifier le storage

8. Aller dans **Storage** (menu de gauche)
9. Confirmer que le bucket `coin-images` a ete cree et qu'il est en mode **Public**

---

## Etape 3 — Configurer l'authentification Google

### Cote Google Cloud

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Creer un nouveau projet (ex: `numis`)
3. Aller dans **APIs & Services** > **OAuth consent screen**
   - Choisir **External**
   - Remplir le nom de l'app (`Numis`), l'email de support, et sauvegarder
4. Aller dans **APIs & Services** > **Credentials**
5. Cliquer **Create Credentials** > **OAuth Client ID**
   - Type : **Web application**
   - Nom : `Numis Web`
   - **Authorized redirect URIs** : ajouter
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (remplacer `xxxxx` par l'ID de votre projet Supabase)
6. Copier le **Client ID** et le **Client Secret**

### Cote Supabase

7. Aller dans **Authentication** > **Providers** > **Google**
8. Activer le provider Google
9. Coller le **Client ID** et **Client Secret** obtenus a l'etape precedente
10. Sauvegarder

---

## Etape 4 — Configurer les URL de redirection Supabase

1. Aller dans **Authentication** > **URL Configuration**
2. Remplir les champs :
   - **Site URL** : `https://votre-domaine.vercel.app`
   - **Redirect URLs** : ajouter
     ```
     https://votre-domaine.vercel.app/auth/callback
     ```
3. Sauvegarder

> Note : vous obtiendrez l'URL exacte de Vercel a l'etape 6. Vous pourrez revenir ici la modifier.

---

## Etape 5 — Pousser le code sur GitHub

Si ce n'est pas deja fait :

1. Creer un repository sur GitHub (ex: `numis`)
2. Pousser le code :
   ```bash
   git remote set-url origin https://github.com/votre-username/numis.git
   git push -u origin main
   ```

---

## Etape 6 — Deployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub
2. Cliquer **Add New** > **Project**
3. Selectionner le repository `numis`
4. Dans **Environment Variables**, ajouter :

   | Variable | Valeur |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

5. Cliquer **Deploy**
6. Attendre la fin du build (~1-2 minutes)
7. Votre site est en ligne a l'adresse affichee (ex: `numis-abc123.vercel.app`)

---

## Etape 7 — Mettre a jour les URL de redirection

Maintenant que vous avez l'URL Vercel definitive :

1. **Supabase** > **Authentication** > **URL Configuration** :
   - **Site URL** : `https://numis-abc123.vercel.app`
   - **Redirect URLs** : `https://numis-abc123.vercel.app/auth/callback`

2. **Google Cloud** > **Credentials** > votre OAuth Client :
   - Verifier que le redirect URI Supabase est toujours correct :
     `https://xxxxx.supabase.co/auth/v1/callback`

---

## Etape 8 — Tester le site

1. Ouvrir l'URL Vercel dans un navigateur
2. Tester les fonctionnalites :
   - [ ] Inscription par email
   - [ ] Connexion par email
   - [ ] Connexion via Google
   - [ ] Ajout d'une piece avec photos avers/revers
   - [ ] Modification d'une piece
   - [ ] Suppression d'une piece
   - [ ] Recherche et filtres dans la collection
   - [ ] Consultation d'un profil public
   - [ ] Modification du profil (bio, avatar)
   - [ ] Envoi d'une offre d'echange
   - [ ] Reception et acceptation/refus d'une offre

---

## Optionnel — Domaine personnalise

Si vous souhaitez un nom de domaine personnalise (ex: `numis.fr`) :

1. Acheter un domaine chez un registrar (OVH, Namecheap, Google Domains...)
2. Dans Vercel > **Settings** > **Domains** : ajouter votre domaine
3. Configurer les enregistrements DNS comme indique par Vercel :
   - Type `CNAME` pointant vers `cname.vercel-dns.com`
4. Mettre a jour les URLs dans Supabase et Google Cloud avec le nouveau domaine

---

## Recapitulatif des couts

| Service | Cout | Limite gratuite |
|---|---|---|
| GitHub | Gratuit | Illimite |
| Supabase | Gratuit | 500 MB BDD, 1 GB storage, 50k users |
| Vercel | Gratuit | 100 GB bandwidth/mois |
| Google Cloud OAuth | Gratuit | Illimite |
| Domaine (optionnel) | ~5-15 EUR/an | — |

**Cout total : 0 EUR** (sans domaine personnalise)

---

## Depannage

### Le site affiche une erreur Supabase au chargement
- Verifier que les variables d'environnement sont correctement definies dans Vercel
- Aller dans Vercel > **Settings** > **Environment Variables** pour verifier

### L'authentification Google ne fonctionne pas
- Verifier que le redirect URI dans Google Cloud correspond exactement a `https://xxxxx.supabase.co/auth/v1/callback`
- Verifier que le provider Google est bien active dans Supabase
- Verifier que le Site URL et les Redirect URLs sont corrects dans Supabase

### Les images ne s'affichent pas
- Verifier que le bucket `coin-images` est en mode **Public** dans Supabase Storage
- Verifier que les politiques RLS du storage ont ete creees (presentes dans `schema.sql`)

### La base de donnees est endormie (premiere requete lente)
- Normal sur le free tier Supabase : la BDD s'endort apres 1 semaine d'inactivite
- Le premier appel prend ~5 secondes pour reveiller la BDD
- Pour eviter : passer au plan Pro ou mettre en place un ping automatique
