import { DiscordIcon } from "./discord-icon";

export function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl text-foreground tracking-wider">
              ELDER
            </span>
            <span className="text-primary font-display text-3xl">CLAN</span>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              About
            </a>
            <a
              href="#discord"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Discord
            </a>
            <a
              href="https://kirka.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Play Kirka.io
            </a>
          </div>

          <a
            href="https://discord.gg/NdhYzYm6a"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
            aria-label="Join our Discord"
          >
            <DiscordIcon className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ELDER Clan. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Not affiliated with Kirka.io
          </p>
        </div>
      </div>
    </footer>
  );
}
