import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";
import { Palette, Plus, Copy, Check, Trash2, ChevronDown, ChevronUp, Loader2, Pencil } from "lucide-react";

interface CSSData {
  id: string;
  title: string;
  description: string | null;
  css_code: string;
  preview_image: string | null;
  submitted_by: string;
  created_at: string;
  submitter: { discord_username: string; discord_avatar: string | null } | null;
}

export function CSSPage() {
  const { member: currentMember } = useAuth();
  const [skins, setSkins] = useState<CSSData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", css_code: "", preview_image: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "", css_code: "", preview_image: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSkins();
  }, []);

  async function loadSkins() {
    const { data } = await supabase
      .from("css_skins")
      .select("*, submitter:members(discord_username, discord_avatar)")
      .order("created_at", { ascending: false });

    if (data) setSkins(data as unknown as CSSData[]);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!currentMember) return;
    setIsAdding(true);

    const { error } = await supabase.from("css_skins").insert({
      title: formData.title,
      description: formData.description || null,
      css_code: formData.css_code,
      preview_image: formData.preview_image || null,
      submitted_by: currentMember.id,
    });

    setIsAdding(false);
    if (!error) {
      setShowAdd(false);
      setFormData({ title: "", description: "", css_code: "", preview_image: "" });
      loadSkins();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this CSS skin?")) return;
    await supabase.from("css_skins").delete().eq("id", id);
    loadSkins();
  }

  function startEdit(skin: CSSData) {
    setEditingId(skin.id);
    setEditData({
      title: skin.title,
      description: skin.description || "",
      css_code: skin.css_code,
      preview_image: skin.preview_image || "",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("css_skins")
      .update({
        title: editData.title,
        description: editData.description || null,
        css_code: editData.css_code,
        preview_image: editData.preview_image || null,
      })
      .eq("id", editingId);

    setIsSaving(false);
    if (!error) {
      setEditingId(null);
      loadSkins();
    }
  }

  async function copyCode(code: string, id: string) {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">
            CSS SKINS
          </h1>
          <p className="text-muted-foreground">
            Custom Kirka.io themes and skins shared by our clan.
          </p>
        </div>
        {currentMember && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Skin
          </button>
        )}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-2">How to use CSS skins in Kirka.io</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Install a browser extension like Stylus or User CSS</li>
          <li>Create a new style for kirka.io</li>
          <li>Copy and paste the CSS code from below</li>
          <li>Save and enjoy your custom look!</li>
        </ol>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Share a CSS Skin</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skin Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Neon Glow Theme"
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this skin change?"
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CSS Code</label>
              <textarea
                value={formData.css_code}
                onChange={(e) => setFormData({ ...formData, css_code: e.target.value })}
                placeholder="/* Your CSS code here */"
                className="w-full font-mono text-sm min-h-32 resize-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preview Image URL (optional)</label>
              <input
                type="url"
                value={formData.preview_image}
                onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Skin"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingId && (
        <div className="bg-card border border-primary/30 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Edit CSS Skin</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skin Name</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CSS Code</label>
              <textarea
                value={editData.css_code}
                onChange={(e) => setEditData({ ...editData, css_code: e.target.value })}
                className="w-full font-mono text-sm min-h-32 resize-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preview Image URL (optional)</label>
              <input
                type="url"
                value={editData.preview_image}
                onChange={(e) => setEditData({ ...editData, preview_image: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {skins.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {skins.map((skin) => (
            <div
              key={skin.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              {skin.preview_image ? (
                <div className="h-48 bg-secondary">
                  <img src={skin.preview_image} alt={skin.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-secondary/50 flex items-center justify-center">
                  <Palette className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}

              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{skin.title}</h3>
                {skin.description && (
                  <p className="text-sm text-muted-foreground">{skin.description}</p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setExpandedId(expandedId === skin.id ? null : skin.id)}
                    className="w-full flex items-center justify-between border border-border bg-background px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
                  >
                    <span>View CSS Code</span>
                    {expandedId === skin.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {expandedId === skin.id && (
                    <div className="relative">
                      <pre className="p-3 bg-secondary rounded-md text-xs overflow-x-auto max-h-64 overflow-y-auto">
                        <code>{skin.css_code}</code>
                      </pre>
                      <button
                        onClick={() => copyCode(skin.css_code, skin.id)}
                        className="absolute top-2 right-2 inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-medium transition-colors"
                      >
                        {copiedId === skin.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {skin.submitter?.discord_avatar ? (
                    <img src={skin.submitter.discord_avatar} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20" />
                  )}
                  <span>{skin.submitter?.discord_username || "Unknown"}</span>
                </div>
                {currentMember && currentMember.id === skin.submitted_by && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(skin)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit skin"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skin.id)}
                      className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete skin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-border rounded-lg py-8 text-center">
          <Palette className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No CSS Skins Yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to share a custom Kirka.io skin with the clan!
          </p>
        </div>
      )}
    </div>
  );
}
