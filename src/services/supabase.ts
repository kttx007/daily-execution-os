import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

function normalizeCredentials(email: string, password: string) {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) throw new Error("请输入邮箱地址。");
  if (password.length < 6) throw new Error("密码至少 6 位。");
  return { email: normalizedEmail, password };
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase 尚未配置。");
  const credentials = normalizeCredentials(email, password);

  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw new Error(error.message);
  return data;
}

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase 尚未配置。");
  const credentials = normalizeCredentials(email, password);

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
