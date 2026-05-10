import { useAuth } from "../lib/auth-context";
import { DiscordIcon } from "../components/discord-icon";
import { ShieldX, RotateCcw } from "lucide-react";

export function AccessDeniedPage() {
  const { signInWithDiscord, signOut } = useAuth();

  async function handleRetry() {
    await signOut();
    await signInWithDiscord();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="font-display text-3xl text-foreground mb-2">
            ACCESS DENIED
          </h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have the Elder Members role in our Discord server.
          </p>

          <div className="p-4 bg-secondary/50 rounded-lg border border-border mb-6">
            <p className="text-sm text-muted-foreground">
              To access the clan section, you need to be a verified member of the Elder Clan
              with the <span className="text-primary font-semibold">Elder Members</span> role.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2 py-3 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>

            <a
              href="https://discord.gg/NdhYzYm6a"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#5865F2]/50 hover:bg-[#5865F2]/10 text-[#5865F2] gap-2 py-3 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              <DiscordIcon className="w-5 h-5" />
              Join Our Discord
            </a>

            <a
              href="/"
              className="w-full border border-border hover:bg-secondary py-3 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
