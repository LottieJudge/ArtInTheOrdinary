import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
export async function POST(req) {
  try {
    const {
      first_name,
      last_name,
      email_address,
      company_name,
      firstLine_address,
      house_apartment_number,
      city,
      country,
      state_province,
      post_code,
      phone_number,
      item_ordered,
      size
    } = await req.json()

    const { error } = await supabase.from('CustomerInfo').insert([
      {
        first_name,
        last_name,
        email_address,
        company_name,
        firstLine_address,
        house_apartment_number,
        city,
        country,
        state_province,
        post_code,
        phone_number,
        item_ordered,
        size
      }
    ])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
  }
}