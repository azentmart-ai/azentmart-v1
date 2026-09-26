import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = "https://mmuwacqurzwoofhunzqk.supabase.co";

const supabasePublishableKey =
  "sb_publishable_YHHQbjzUqlZECsIfHEXvkA_sbtbkFqq";

// Use the same SSR browser client/session mechanism
// as the Backend authentication application.
//
// This allows the Frontend dashboard to read the
// Supabase auth session created by the Backend login.
export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey
);