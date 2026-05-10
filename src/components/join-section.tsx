import { Check } from "lucide-react";

const requirements = [
  "Active on Discord",
  "K/D ratio of 1.5 or higher",
  "Team player mentality",
  "Respectful and mature",
  "Available for clan events",
];

export function JoinSection() {
  return (
    <section id="join" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Recruitment
            </span>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-foreground mb-8">
              BECOME AN<br />
              <span className="text-primary">ELDER</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Think you have what it takes to join the elite? We're always
              looking for skilled players who want to compete at the highest level
              and be part of something bigger.
            </p>

            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12">
              <h3 className="font-display text-4xl text-foreground mb-4">
                READY TO JOIN?
              </h3>
              <p className="text-muted-foreground mb-8">
                Head over to our Discord server and apply in the recruitment
                channel. Our officers will review your application and get back
                to you within 24-48 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-semibold">Step 1:</span>
                  <span className="text-muted-foreground">Join our Discord</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-semibold">Step 2:</span>
                  <span className="text-muted-foreground">Read the rules</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-semibold">Step 3:</span>
                  <span className="text-muted-foreground">Submit your application</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-semibold">Step 4:</span>
                  <span className="text-muted-foreground">Wait for officer review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
