// Thin Supabase REST helper — no SDK dependency. Stays completely dormant
// until VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, so the app works
// on local storage alone today and switches to the cloud DB with just keys.
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const remoteEnabled = Boolean(URL && KEY)

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
