import { createBrowserClient } from "@supabase/ssr";

// biome-ignore lint/style/noNonNullAssertion: Environment variables are required
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// biome-ignore lint/style/noNonNullAssertion: Environment variables are required
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
