import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>; // 👈 added
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {}, // 👈 added
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Extracted fetcher into reusable function
  const refreshUser = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user ?? null;

    if (sessionUser) {
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (!error && userData) {
        setUser({ ...sessionUser, ...userData });
      } else {
        console.warn("⚠️ Could not fetch user metadata from 'users' table:", error);
        setUser(sessionUser);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
