import { Target, Users, Trophy, Crosshair } from "lucide-react";

const stats = [
  { icon: Users, label: "Active Members", value: "50+" },
  { icon: Trophy, label: "Tournaments Won", value: "25+" },
  { icon: Target, label: "K/D Average", value: "2.8" },
  { icon: Crosshair, label: "Matches Played", value: "10K+" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            Who We Are
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
            FORGED IN<br />
            <span className="text-primary">BATTLE</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="font-display text-4xl md:text-5xl text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            ELDER Clan was founded by veterans of the Kirka.io competitive scene.
            We're not just a team -- we're a family of dedicated players who push
            each other to be better every single day. Our members dominate leaderboards,
            win tournaments, and most importantly, have fun doing it.
          </p>
        </div>
      </div>
    </section>
  );
}
