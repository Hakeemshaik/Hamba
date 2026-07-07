// Thin Supabase REST helper — no SDK dependency. The defaults below are the
// project's PUBLIC anon credentials: they are designed to ship in the frontend
// bundle (Row Level Security in supabase/schema.sql is what protects data —
// the anon role can only INSERT, never read others' rows). Env vars override
// them for staging or a future project swap.
const URL = import.meta.env.VITE_SUPABASE_URL || 'https://dhzyqvjbknkgweuiothi.supabase.co'
const KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenlxdmpia25rZ3dldWlvdGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMzAyMjMsImV4cCI6MjA5ODkwNjIyM30.pCwZ2XPSeH-1FEETRkKnQwXekNPVK4yWi2dN44sxnp4'

export const remoteEnabled = Boolean(URL && KEY)

export async function remoteSelect<T = Record<string, unknown>>(table: string, query: string): Promise<T[] | null> {
  if (!remoteEnabled) return null
  try {
    const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` },
    })
    if (!res.ok) return null
    return (await res.json()) as T[]
  } catch {
    return null
  }
}

export async function remoteUpdate(table: string, query: string, patch: Record<string, unknown>): Promise<boolean> {
  if (!remoteEnabled) return false
  try {
    const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
      method: 'PATCH',
      headers: {
        apikey: KEY as string,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(patch),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function remoteInsert(table: string, row: Record<string, unknown>): Promise<void> {
  if (!remoteEnabled) return
  try {
    await fetch(`${URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: KEY as string,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    })
  } catch {
    // Offline / not reachable — local storage already has the record.
  }
}
