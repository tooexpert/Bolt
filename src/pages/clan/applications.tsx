import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";
import {
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

interface Application {
  id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string | null;
  ticket_channel_id: string;
  ticket_channel_name: string;
  status: "pending" | "accepted" | "rejected" | "closed";
  application_content: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  reviewer: { discord_username: string } | null;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-muted/10",
    border: "border-muted/30",
  },
};

export function ApplicationsPage() {
  const { member: currentMember } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*, reviewer:members!reviewed_by(discord_username)")
      .order("created_at", { ascending: false });

    if (data) setApplications(data as unknown as Application[]);
    setLoading(false);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-applications`;
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers,
      });

      const result = await res.json();
      if (result.success) {
        await loadApplications();
      }
    } catch (err) {
      console.error("Sync failed:", err);
    }
    setSyncing(false);
  }

  async function updateStatus(id: string, status: "accepted" | "rejected") {
    if (!currentMember) return;
    setUpdatingId(id);

    const { error } = await supabase
      .from("applications")
      .update({
        status,
        reviewed_by: currentMember.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    setUpdatingId(null);
    if (!error) {
      loadApplications();
    }
  }

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    closed: applications.filter((a) => a.status === "closed").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">
            APPLICATIONS
          </h1>
          <p className="text-muted-foreground">
            Elder applicant tickets synced from Discord.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {syncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync from Discord
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "accepted", "rejected", "closed"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app) => {
            const config = statusConfig[app.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className={`bg-card border rounded-lg overflow-hidden transition-colors ${
                  app.status === "pending"
                    ? "border-amber-500/30"
                    : "border-border"
                }`}
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : app.id)
                  }
                >
                  <div className="flex-shrink-0">
                    {app.discord_avatar ? (
                      <img
                        src={app.discord_avatar}
                        alt={app.discord_username}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">
                        {app.discord_username}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {app.ticket_channel_name || `Ticket #${app.ticket_channel_id.slice(-6)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {app.application_content && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Application Content
                        </h4>
                        <div className="bg-secondary rounded-md p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {app.application_content}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Discord ID:</span>{" "}
                        <span className="font-mono">{app.discord_id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Channel:</span>{" "}
                        <span className="font-mono">{app.ticket_channel_id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>{" "}
                        {new Date(app.created_at).toLocaleString()}
                      </div>
                      {app.reviewer && (
                        <div>
                          <span className="text-muted-foreground">
                            Reviewed by:
                          </span>{" "}
                          {app.reviewer.discord_username}
                        </div>
                      )}
                      {app.reviewed_at && (
                        <div>
                          <span className="text-muted-foreground">
                            Reviewed at:
                          </span>{" "}
                          {new Date(app.reviewed_at).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`https://discord.com/channels/${"1369832704102633554"}/${app.ticket_channel_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Discord
                      </a>

                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app.id, "accepted");
                            }}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {updatingId === app.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app.id, "rejected");
                            }}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {updatingId === app.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-border rounded-lg py-12 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            No Applications Found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Sync from Discord" to pull ticket data from your server.
          </p>
        </div>
      )}
    </div>
  );
}
