import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import { LogOut, Shield } from "lucide-react";

export function ClanHeader() {
  const { member, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <Link to="/clan" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-display text-xl">ELDER CLAN</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {member?.discord_avatar ? (
              <img
                src={member.discord_avatar}
                alt={member.discord_username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {member?.discord_username?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <span className="text-sm font-medium hidden sm:block">
              {member?.discord_username}
            </span>
          </div>

          <button
            onClick={signOut}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
