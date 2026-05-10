import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";
import { Quote, Loader2 } from "lucide-react";

interface Member {
  id: string;
  discord_username: string;
  discord_avatar: string | null;
  quote: string;
}

export function QuotesPage() {
  const { member: currentMember } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [quote, setQuote] = useState(currentMember?.quote || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    if (currentMember?.quote !== undefined) {
      setQuote(currentMember.quote || "");
    }
  }, [currentMember]);

  async function loadQuotes() {
    const { data } = await supabase
      .from("members")
      .select("id, discord_username, discord_avatar, quote")
      .neq("quote", "")
      .order("updated_at", { ascending: false });

    if (data) setMembers(data);
  }

  async function handleSave() {
    if (!currentMember) return;
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("members")
      .update({ quote })
      .eq("id", currentMember.id);

    setIsLoading(false);

    if (error) {
      setMessage({ type: "error", text: "Failed to update quote. Try again." });
    } else {
      setMessage({ type: "success", text: "Quote updated successfully!" });
      loadQuotes();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-foreground mb-2">
          CLAN QUOTES
        </h1>
        <p className="text-muted-foreground">
          Wisdom, humor, and legendary moments from our members.
        </p>
      </div>

      {currentMember && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-2 font-semibold mb-4">
            <Quote className="w-5 h-5 text-primary" />
            Your Quote
          </div>
          <div className="space-y-4">
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Share your wisdom, a funny moment, or your clan motto..."
              className="w-full min-h-24 resize-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {quote.length}/280 characters
              </span>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Quote"
                )}
              </button>
            </div>
            {message && (
              <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">All Member Quotes</h2>
        {members.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  {member.discord_avatar ? (
                    <img
                      src={member.discord_avatar}
                      alt={member.discord_username}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-medium text-primary">
                        {member.discord_username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <blockquote className="text-foreground italic">
                      &ldquo;{member.quote}&rdquo;
                    </blockquote>
                    <p className="text-sm text-muted-foreground mt-2">
                      - {member.discord_username}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary/30 border border-border rounded-lg py-8 text-center text-muted-foreground">
            No quotes yet. Be the first to share your wisdom!
          </div>
        )}
      </div>
    </div>
  );
}
