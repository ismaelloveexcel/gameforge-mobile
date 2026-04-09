-- GiftVerse Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gifts table (core)
create table public.gifts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  gift_type text not null check (gift_type in ('gift_game', 'birthday_card', 'invitation')),
  occasion text not null,
  sender_name text not null,
  recipient_name text not null,
  tone text not null,
  visual_style text not null,
  personal_message text,
  content_blocks jsonb not null default '[]'::jsonb,
  assets jsonb not null default '[]'::jsonb,
  payment_status text not null default 'free' check (payment_status in ('free', 'pending', 'paid', 'failed')),
  share_slug text unique not null,
  share_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  gift_id uuid references public.gifts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  stripe_session_id text,
  stripe_payment_intent text,
  amount integer not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RSVPs table (for invitations)
create table public.rsvps (
  id uuid default uuid_generate_v4() primary key,
  gift_id uuid references public.gifts(id) on delete cascade not null,
  respondent_name text,
  respondent_email text,
  response text not null check (response in ('attending', 'maybe', 'declined')),
  created_at timestamptz default now()
);

-- Analytics events (lean)
create table public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  gift_id uuid references public.gifts(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index idx_gifts_user_id on public.gifts(user_id);
create index idx_gifts_share_slug on public.gifts(share_slug);
create index idx_payments_gift_id on public.payments(gift_id);
create index idx_rsvps_gift_id on public.rsvps(gift_id);
create index idx_analytics_gift_id on public.analytics_events(gift_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.gifts enable row level security;
alter table public.payments enable row level security;
alter table public.rsvps enable row level security;
alter table public.analytics_events enable row level security;

-- Policies: profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Policies: gifts
create policy "Users can view own gifts" on public.gifts for select using (auth.uid() = user_id);
create policy "Anyone can view gift by share_slug" on public.gifts for select using (true);
create policy "Users can insert own gifts" on public.gifts for insert with check (auth.uid() = user_id);
create policy "Users can update own gifts" on public.gifts for update using (auth.uid() = user_id);

-- Policies: payments
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() = user_id);

-- Policies: rsvps (anyone can RSVP to a gift)
create policy "Anyone can insert RSVP" on public.rsvps for insert with check (true);
create policy "Gift owner can view RSVPs" on public.rsvps for select using (
  exists (select 1 from public.gifts where gifts.id = rsvps.gift_id and gifts.user_id = auth.uid())
);

-- Policies: analytics
create policy "Anyone can insert analytics" on public.analytics_events for insert with check (true);
create policy "Gift owner can view analytics" on public.analytics_events for select using (
  exists (select 1 from public.gifts where gifts.id = analytics_events.gift_id and gifts.user_id = auth.uid())
);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gifts_updated_at before update on public.gifts for each row execute function update_updated_at();
create trigger payments_updated_at before update on public.payments for each row execute function update_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function update_updated_at();
