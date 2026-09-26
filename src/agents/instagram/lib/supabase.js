import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  "https://yrjkppfhkrqtazjxoztg.supabase.co";

const supabasePublishableKey =
  "sb_publishable_uWqpCc3mV4QJZz83WTNshg_EqDnLMfI";

export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey
);