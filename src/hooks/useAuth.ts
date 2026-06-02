import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, isSupabaseConfigured, signInWithPassword, signOut, signUpWithPassword, supabase } from "@/services/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((current) => mounted && setUser(current))
      .finally(() => mounted && setLoading(false));
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => signInWithPassword(email, password), []);
  const register = useCallback(async (email: string, password: string) => signUpWithPassword(email, password), []);
  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  return { user, loading, login, register, logout, configured: isSupabaseConfigured };
}
