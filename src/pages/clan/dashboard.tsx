import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Quote, Map, Palette, Users, FileText } from "lucide-react";

interface MemberQuote {
  quote: string;
  discord_username: string;
}

export function ClanDashboard() {
  const [stats, setStats] = useState([
    { label: "Elder Members", value: 0, icon: Users, href: "/clan/members", color: "text-blue-500" },
    { label: "Custom Maps", value: 0, icon: Map, href: "/clan/maps", color: "text-green-500" },
    { label: "CSS Skins", value: 0, icon: Palette, href: "/clan/css", color: "text-purple-500" },
    { label: "Pending Apps", value: 0, icon: FileText, href: "/clan/applications", color: "text-amber-500" },
  ]);
  const [randomQuote, setRandomQuote] = useState<MemberQuote | null>(null);

  useEffect(() => {
    async function loadData() {
      const [membersRes, mapsRes, cssRes, appsRes] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }).eq("is_elder_member", true),
        supabase.from("maps").select("id", { count: "exact", head: true }),
        supabase.from("css_skins").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats([
        { label: "Elder Members", value: membersRes.count || 0, icon: Users, href: "/clan/members", color: "text-blue-500" },
        { label: "Custom Maps", value: mapsRes.count || 0, icon: Map, href: "/clan/maps", color: "text-green-500" },
        { label: "CSS Skins", value: cssRes.count || 0, icon: Palette, href: "/clan/css", color: "text-purple-500" },
        { label: "Pending Apps", value: appsRes.count || 0, icon: FileText, href: "/clan/applications", color: "text-amber-500" },
      ]);

      const { data: quotesData } = await supabase
        .from("members")
        .select("quote, discord_username")
        .neq("quote", "")
        .limit(10);

      if (quotesData && quotesData.length > 0) {
        setRandomQuote(quotesData[Math.floor(Math.random() * quotesData.length)]);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-foreground mb-2">
          CLAN HEADQUARTERS
        </h1>
        <p className="text-muted-foreground">
          Welcome back, Elder. Here&apos;s what&apos;s happening in the clan.
        </p>
      </div>

      {randomQuote && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3">
            <Quote className="w-5 h-5 text-primary" />
            Quote of the Day
          </div>
          <blockquote className="text-lg italic text-foreground">
            &ldquo;{randomQuote.quote}&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">
            - {randomQuote.discord_username}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/clan/quotes" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
          <Quote className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">Update Your Quote</h3>
          <p className="text-sm text-muted-foreground">
            Share your wisdom with the clan. Your quote might be featured!
          </p>
        </Link>

        <Link to="/clan/maps" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
          <Map className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Browse Maps</h3>
          <p className="text-sm text-muted-foreground">
            Discover custom Kirka.io maps shared by clan members.
          </p>
        </Link>

        <Link to="/clan/css" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
          <Palette className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="font-semibold text-lg mb-2">CSS Skins</h3>
          <p className="text-sm text-muted-foreground">
            Customize your Kirka.io experience with community skins.
          </p>
        </Link>

        <Link to="/clan/applications" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
          <FileText className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Applications</h3>
          <p className="text-sm text-muted-foreground">
            Review Elder applicant tickets synced from Discord.
          </p>
        </Link>
      </div>
    </div>
  );
}
