import { DiscordIcon } from "./discord-icon";
import { MessageSquare, Headphones, Gamepad2, Shield } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Active Chat",
    description: "24/7 active community discussions and strategy talks",
  },
  {
    icon: Headphones,
    title: "Voice Channels",
    description: "Team up with voice comms for coordinated gameplay",
  },
  {
    icon: Gamepad2,
    title: "Scrims & Events",
    description: "Regular practice matches and clan tournaments",
  },
  {
    icon: Shield,
    title: "Exclusive Content",
    description: "Member-only tips, guides, and gameplay reviews",
  },
];

export function DiscordSection() {
  return (
    <section id="discord" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            Join The Community
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground mb-6">
            CONNECT ON<br />
            <span className="text-primary">DISCORD</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our Discord server is the heart of our clan. Connect with fellow warriors,
            join voice channels, and stay updated on all clan activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:bg-card"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://discord.gg/NdhYzYm6a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-[#5865F2] hover:bg-[#4752C4] text-white px-10 py-7 text-xl rounded-lg shadow-lg shadow-[#5865F2]/20 font-medium transition-colors"
          >
            <DiscordIcon className="w-8 h-8" />
            <span className="font-display tracking-wide">JOIN DISCORD SERVER</span>
          </a>
          <p className="text-muted-foreground mt-6 text-sm">
            500+ members online now
          </p>
        </div>
      </div>
    </section>
  );
}
