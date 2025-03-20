import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const supabaseAnonKey = process.env
  .NEXT_PUBLIC_SUPABSE_API_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
