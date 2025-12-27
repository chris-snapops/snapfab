import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabasePublishableDefaultKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder';

// console.log(`supabaseUrl: ${supabaseUrl}`);
export const supabase = createClient(supabaseUrl, supabasePublishableDefaultKey);