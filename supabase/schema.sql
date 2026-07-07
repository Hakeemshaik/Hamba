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

-- Cross-device jobs: drivers read open bookings and accept/complete them,
-- and customers watch their booking's live status. Bookings hold no customer
-- contact details (suburbs, service, price only). Tighten these to real
-- per-user auth before scaling beyond the pilot.
alter table bookings add column if not exists driver_name text;

create policy "anon can read bookings" on bookings
  for select to anon using (true);

create policy "anon can update booking status" on bookings
  for update to anon using (true) with check (true);

create table if not exists drivers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text not null,
  email            text,
  id_type          text,
  id_number        text,
  licence_number   text,
  licence_code     text,
  licence_expiry   date,
  has_prdp         boolean,
  criminal_consent boolean,
  driving_consent  boolean,
  vehicle_type     text,
  vehicle_make     text,
  vehicle_model    text,
  vehicle_reg      text,
  vehicle_year     text,
  load_capacity    text,
  vehicle_dims     text,
  assistants       int,
  commercial_cover boolean,
  ref_name         text,
  ref_phone        text,
  training_ack     boolean,
  bank_holder      text,
  bank_name        text,
  bank_account     text,
  status           text not null default 'pending',  -- pending | approved | suspended
  created_at       timestamptz not null default now()
);

alter table drivers enable row level security;
create policy "anon can create drivers" on drivers
  for insert to anon with check (true);

create table if not exists complaints (
  id          text primary key,             -- e.g. CMP-481204
  category    text not null,
  booking_ref text,
  message     text not null,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

-- Insurance quote requests: check this table daily for people to call.
create table if not exists insurance_leads (
  id          text primary key,             -- e.g. INS-481204
  name        text not null,
  phone       text not null,
  email       text,
  booking_ref text,
  note        text,
  status      text not null default 'new',  -- new | contacted | closed
  created_at  timestamptz not null default now()
);

alter table insurance_leads enable row level security;
create policy "anon can create insurance leads" on insurance_leads
  for insert to anon with check (true);

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
