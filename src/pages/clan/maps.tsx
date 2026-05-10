import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";
import { Map, Plus, Copy, Check, Trash2, Loader2, Pencil } from "lucide-react";

interface MapData {
  id: string;
  title: string;
  description: string | null;
  map_code: string;
  image_url: string | null;
  submitted_by: string;
  created_at: string;
  submitter: { discord_username: string; discord_avatar: string | null } | null;
}

export function MapsPage() {
  const { member: currentMember } = useAuth();
  const [maps, setMaps] = useState<MapData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", map_code: "", image_url: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "", map_code: "", image_url: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMaps();
  }, []);

  async function loadMaps() {
    const { data } = await supabase
      .from("maps")
      .select("*, submitter:members(discord_username, discord_avatar)")
      .order("created_at", { ascending: false });

    if (data) setMaps(data as unknown as MapData[]);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!currentMember) return;
    setIsAdding(true);

    const { error } = await supabase.from("maps").insert({
      title: formData.title,
      description: formData.description || null,
      map_code: formData.map_code,
      image_url: formData.image_url || null,
      submitted_by: currentMember.id,
    });

    setIsAdding(false);
    if (!error) {
      setShowAdd(false);
      setFormData({ title: "", description: "", map_code: "", image_url: "" });
      loadMaps();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this map?")) return;
    await supabase.from("maps").delete().eq("id", id);
    loadMaps();
  }

  function startEdit(map: MapData) {
    setEditingId(map.id);
    setEditData({
      title: map.title,
      description: map.description || "",
      map_code: map.map_code,
      image_url: map.image_url || "",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("maps")
      .update({
        title: editData.title,
        description: editData.description || null,
        map_code: editData.map_code,
        image_url: editData.image_url || null,
      })
      .eq("id", editingId);

    setIsSaving(false);
    if (!error) {
      setEditingId(null);
      loadMaps();
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
            CUSTOM MAPS
          </h1>
          <p className="text-muted-foreground">
            Kirka.io map codes shared by our clan members.
          </p>
        </div>
        {currentMember && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Map
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Share a Custom Map</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Map Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Epic Sniper Arena"
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Map Code</label>
              <input
                type="text"
                value={formData.map_code}
                onChange={(e) => setFormData({ ...formData, map_code: e.target.value })}
                placeholder="e.g., ABC123"
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the map..."
                className="w-full resize-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preview Image URL (optional)</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
                  "Add Map"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingId && (
        <div className="bg-card border border-primary/30 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Edit Map</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Map Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Map Code</label>
              <input
                type="text"
                value={editData.map_code}
                onChange={(e) => setEditData({ ...editData, map_code: e.target.value })}
                required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full resize-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preview Image URL (optional)</label>
              <input
                type="url"
                value={editData.image_url}
                onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
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

      {maps.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <div
              key={map.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              {map.image_url ? (
                <div className="h-40 bg-secondary">
                  <img src={map.image_url} alt={map.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 bg-secondary/50 flex items-center justify-center">
                  <Map className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}

              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{map.title}</h3>
                {map.description && (
                  <p className="text-sm text-muted-foreground">{map.description}</p>
                )}
                <div className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                  <code className="text-sm text-foreground flex-1 truncate">
                    {map.map_code}
                  </code>
                  <button
                    onClick={() => copyCode(map.map_code, map.id)}
                    className="p-1 hover:bg-secondary/80 rounded transition-colors"
                  >
                    {copiedId === map.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {map.submitter?.discord_avatar ? (
                    <img src={map.submitter.discord_avatar} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20" />
                  )}
                  <span>{map.submitter?.discord_username || "Unknown"}</span>
                </div>
                {currentMember && currentMember.id === map.submitted_by && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(map)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit map"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(map.id)}
                      className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete map"
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
          <Map className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No Maps Yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to share a custom Kirka.io map with the clan!
          </p>
        </div>
      )}
    </div>
  );
}
