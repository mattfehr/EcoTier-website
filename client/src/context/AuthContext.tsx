import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user ?? null;

      if (sessionUser) {
        // Try to load the user’s metadata from the "User" table
        const { data: userData, error } = await supabase
          .from("users") // ✅ lowercase table name
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        if (!error && userData) {
          setUser({ ...sessionUser, ...userData }); // merge Supabase auth and table data
        } else {
          console.warn("⚠️ Could not fetch user metadata from 'User' table:", error);
          setUser(sessionUser); // fallback to auth-only user
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    loadSession();

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
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
