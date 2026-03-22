-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Coins table
create table public.coins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  year int,
  country text,
  grade text,
  image_url text,
  is_for_trade boolean default false not null,
  description text,
  created_at timestamptz default now() not null
);

alter table public.coins enable row level security;

create policy "Coins are viewable by everyone"
  on public.coins for select using (true);

create policy "Users can insert their own coins"
  on public.coins for insert with check (auth.uid() = user_id);

create policy "Users can update their own coins"
  on public.coins for update using (auth.uid() = user_id);

create policy "Users can delete their own coins"
  on public.coins for delete using (auth.uid() = user_id);

-- Offers table
create table public.offers (
  id uuid default gen_random_uuid() primary key,
  coin_id uuid references public.coins(id) on delete cascade not null,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  message text,
  status text default 'pending' not null check (status in ('pending', 'accepted', 'refused')),
  created_at timestamptz default now() not null
);

alter table public.offers enable row level security;

create policy "Users can see offers they sent or received"
  on public.offers for select using (
    auth.uid() = from_user_id or auth.uid() = to_user_id
  );

create policy "Users can create offers"
  on public.offers for insert with check (auth.uid() = from_user_id);

create policy "Offer recipients can update offer status"
  on public.offers for update using (auth.uid() = to_user_id);

-- Index for performance
create index coins_user_id_idx on public.coins(user_id);
create index coins_is_for_trade_idx on public.coins(is_for_trade) where is_for_trade = true;
create index offers_from_user_idx on public.offers(from_user_id);
create index offers_to_user_idx on public.offers(to_user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for coin images
-- Run this in the Supabase dashboard SQL editor:
insert into storage.buckets (id, name, public) values ('coin-images', 'coin-images', true);

create policy "Anyone can view coin images"
  on storage.objects for select using (bucket_id = 'coin-images');

create policy "Authenticated users can upload coin images"
  on storage.objects for insert with check (
    bucket_id = 'coin-images' and auth.role() = 'authenticated'
  );

create policy "Users can update their own coin images"
  on storage.objects for update using (
    bucket_id = 'coin-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own coin images"
  on storage.objects for delete using (
    bucket_id = 'coin-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
