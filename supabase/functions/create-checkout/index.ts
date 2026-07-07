// Supabase Edge Function: create a Yoco Online Checkout for a booking.
//
// Deploy (once you have a Yoco account):
//   1. Supabase dashboard → Edge Functions → New function → "create-checkout",
//      paste this file.
//   2. Edge Functions → create-checkout → Secrets → add YOCO_SECRET_KEY
//      (from Yoco portal → Sell online → Payment gateway keys). The secret
//      key lives ONLY here — never in the app bundle.
//   3. The app then POSTs { bookingId, amountCents } and redirects the
//      customer to the returned checkout URL. Yoco handles the card securely.
//
// Docs: https://developer.yoco.com/online/resources/checkout-api

Deno.serve(async (req) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { bookingId, amountCents } = await req.json()
    if (!bookingId || !Number.isInteger(amountCents) || amountCents < 200) {
      return new Response(JSON.stringify({ error: 'bookingId and a valid amountCents are required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('YOCO_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountCents,
        currency: 'ZAR',
        metadata: { bookingId },
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
