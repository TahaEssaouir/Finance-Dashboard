import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Hada howa l check li kan na9s
if (!supabaseUrl || !supabaseKey) {
  throw new Error("⚠️ Supabase URL ola Key makhdaminch. Vérifier .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseKey)