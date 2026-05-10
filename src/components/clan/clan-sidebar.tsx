import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Home, Quote, Map, Palette, Users, FileText } from "lucide-react";

const navItems = [
  { href: "/clan", label: "Dashboard", icon: Home },
  { href: "/clan/quotes", label: "Quotes", icon: Quote },
  { href: "/clan/maps", label: "Maps", icon: Map },
  { href: "/clan/css", label: "CSS Skins", icon: Palette },
  { href: "/clan/members", label: "Members", icon: Users },
  { href: "/clan/applications", label: "Applications", icon: FileText },
];

export function ClanSidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card min-h-[calc(100vh-64px)]">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
