-- Hamba — minimal cloud database schema.
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- The app works without this (local storage); this turns on the cloud DB.

create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  address     text,
  created_at  timestamptz not null default now()
);

create table if not exists bookings (
  id           text primary key,             -- e.g. HMB-481204
  service_id   text not null,
  service_name text not null,
  pickup       text,
  dropoff      text,
  move_date    date,
  move_time    text,
  total        numeric(10,2) not null,
  method       text,
  status       text not null default 'upcoming',
  created_at   timestamptz not null default now()
);

-- Row Level Security: lock the tables, then allow the public (anon) key to
-- INSERT only. Reading is left to your admin dashboard / service key, so
-- customer data is never publicly listable. Tighten further once you add
-- real per-user auth.
alter table customers enable row level security;
alter table bookings  enable row level security;

create policy "anon can create customers" on customers
  for insert to anon with check (true);

create policy "anon can create bookings" on bookings
  for insert to anon with check (true);

create table if not exists complaints (
  id          text primary key,             -- e.g. CMP-481204
  category    text not null,
  booking_ref text,
  message     text not null,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

create table if not exists messages (
  id          text primary key,             -- e.g. MSG-481204
  name        text,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table complaints enable row level security;
alter table messages   enable row level security;

create policy "anon can create complaints" on complaints
  for insert to anon with check (true);

create policy "anon can create messages" on messages
  for insert to anon with check (true);
