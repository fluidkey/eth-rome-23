import { SupabaseClient } from "@supabase/supabase-js"
import process from "process"

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY as string

const supabase = new SupabaseClient(supabaseUrl, supabaseKey)

export default supabase