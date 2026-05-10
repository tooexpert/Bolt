import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { DiscordIcon } from "./discord-icon";
import { Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#discord", label: "Discord" },
  { href: "#join", label: "Join Us" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, member, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl text-foreground tracking-wider">
              ELDER
            </span>
            <span className="text-primary font-display text-2xl">CLAN</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}

            {user && member?.is_elder_member ? (
              <Link
                to="/clan"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Clan Area</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Clan Login</span>
              </Link>
            )}

            {user && (
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            )}

            <a
              href="https://discord.gg/NdhYzYm6a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#5865F2] hover:text-[#4752C4] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Discord</span>
            </a>
          </div>

          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}

            {user && member?.is_elder_member ? (
              <Link
                to="/clan"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4" />
                <span>Clan Area</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>Clan Login</span>
              </Link>
            )}

            {user && (
              <button
                onClick={() => { signOut(); setIsOpen(false); }}
                className="flex items-center justify-center gap-2 w-full border border-border hover:bg-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

            <a
              href="https://discord.gg/NdhYzYm6a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-[#5865F2] hover:text-[#4752C4] px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Join Discord</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
