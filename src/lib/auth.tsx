import React, { createContext, useContext, useEffect, useState } from "react";

type User = { email: string } | null;
type Profile = { full_name?: string; role?: "business" | "customer" } | null;

type AuthContext = {
  user: User;
  profile: Profile;
  loading: boolean;
  signIn: (email: string, mode?: "signin" | "signup", asBusiness?: boolean) => Promise<void>;
  signOut: () => void;
};

const ctx = createContext<AuthContext>({
  user: null,
  profile: null,
  loading: false,
  signIn: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No-op: in a real app you'd check auth here.
  }, []);

  const signIn = async (email: string, mode: "signin" | "signup" = "signin", asBusiness = false) => {
    setLoading(true);
    // fake delay
    await new Promise((r) => setTimeout(r, 400));
    setUser({ email });
    setProfile({ full_name: email.split("@")[0], role: asBusiness ? "business" : "customer" });
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <ctx.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </ctx.Provider>
  );
}

export function useAuth() {
  return useContext(ctx);
}
