import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Shield } from "lucide-react";

interface Member {
  id: string;
  discord_username: string;
  discord_avatar: string | null;
  quote: string;
  is_elder_member: boolean;
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    async function loadMembers() {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("is_elder_member", true)
        .order("created_at", { ascending: true });

      if (data) setMembers(data);
    }

    loadMembers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-foreground mb-2">
          ELDER MEMBERS
        </h1>
        <p className="text-muted-foreground">
          The legendary warriors of our clan.
        </p>
      </div>

      {members.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {member.discord_avatar ? (
                  <img
                    src={member.discord_avatar}
                    alt={member.discord_username}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-medium text-primary">
                      {member.discord_username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {member.discord_username}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Shield className="w-3 h-3" />
                    <span>Elder Member</span>
                  </div>
                </div>
              </div>
              {member.quote && (
                <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                  &ldquo;{member.quote}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-border rounded-lg py-8 text-center text-muted-foreground">
          No members found.
        </div>
      )}
    </div>
  );
}
