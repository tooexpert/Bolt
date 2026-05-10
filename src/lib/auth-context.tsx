import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

interface Member {
  id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string | null;
  quote: string;
  is_elder_member: boolean;
}

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMember(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchMember(session.user.id);
        } else {
          setMember(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchMember(userId: string) {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setMember(data);
    setLoading(false);
  }

  async function signInWithDiscord() {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: redirectUrl,
        scopes: "identify guilds.members.read",
      },
    });
    if (error) {
      console.error("Discord login error:", error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setMember(null);
  }

  return (
    <AuthContext.Provider value={{ user, member, loading, signInWithDiscord, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
