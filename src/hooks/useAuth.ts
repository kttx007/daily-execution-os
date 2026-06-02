import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, isSupabaseConfigured, signInWithEmail, signOut, supabase } from "@/services/supabase";

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

  const login = useCallback(async (email: string) => signInWithEmail(email), []);
  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  return { user, loading, login, logout, configured: isSupabaseConfigured };
}
