import { useAuth } from "../lib/auth-context";
import { DiscordIcon } from "../components/discord-icon";

export function LoginPage() {
  const { signInWithDiscord } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="mb-6">
            <h1 className="font-display text-4xl text-foreground mb-2">
              CLAN ACCESS
            </h1>
            <p className="text-muted-foreground">
              Login with Discord to access the Elder Clan section
            </p>
          </div>

          <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              You must have the <span className="text-primary font-semibold">Elder Members</span> role
              in our Discord server to access the clan section.
            </p>
          </div>

          <button
            onClick={signInWithDiscord}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2 py-6 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
          >
            <DiscordIcon className="w-5 h-5" />
            Login with Discord
          </button>

          <div className="mt-6 pt-6 border-t border-border">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
