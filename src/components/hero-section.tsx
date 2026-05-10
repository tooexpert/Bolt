import { DiscordIcon } from "./discord-icon";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,60,40,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,60,40,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-full bg-primary/10 tracking-wider uppercase">
            Kirka.io Elite Clan
          </span>
        </div>

        <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.85] tracking-tight text-foreground mb-8">
          <span className="block">WE ARE</span>
          <span className="block text-primary">ELDER</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          A brotherhood of elite warriors dominating the Kirka.io arena.
          Join us and become part of gaming history.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://discord.gg/NdhYzYm6a"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-md font-medium transition-colors"
          >
            <DiscordIcon className="w-6 h-6" />
            <span>Join Our Discord</span>
          </a>
          <a
            href="#about"
            className="inline-flex items-center justify-center border border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-lg rounded-md transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
