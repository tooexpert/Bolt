import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // First try to get provider_token from URL hash before Supabase processes it
        const hash = window.location.hash;
        let providerToken: string | null = null;

        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          providerToken = params.get("provider_token");
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          navigate("/auth-error?error=no_session");
          return;
        }

        // Also check session for provider_token (Supabase sometimes includes it)
        if (!providerToken) {
          providerToken = (session as any).provider_token ?? null;
        }

        const discordId =
          session.user.user_metadata?.provider_id ||
          session.user.user_metadata?.sub;

        const discordUsername =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "Unknown";

        const discordAvatar = session.user.user_metadata?.avatar_url;

        if (!discordId) {
          navigate("/auth-error?error=no_discord_id");
          return;
        }

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-callback`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            provider_token: providerToken,
            discord_id: discordId,
            user_id: session.user.id,
            discord_username: discordUsername,
            discord_avatar: discordAvatar,
          }),
        });

        const data = await response.json();

        if (data.is_elder_member) {
          navigate("/clan", { replace: true });
        } else {
          navigate("/access-denied", { replace: true });
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed. Please try again.");
      }
    }

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <a href="/login" className="text-primary hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Authenticating with Discord...</p>
      </div>
    </div>
  );
}
