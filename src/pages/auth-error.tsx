import { AlertTriangle } from "lucide-react";

export function AuthErrorPage() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="font-display text-3xl text-foreground mb-2">
            AUTH ERROR
          </h1>
          <p className="text-muted-foreground mb-6">
            Sorry, something went wrong during authentication.
          </p>

          {error && (
            <div className="p-4 bg-secondary/50 rounded-lg border border-border mb-6">
              <p className="text-sm text-muted-foreground font-mono">
                Error: {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              Try Again
            </a>

            <a
              href="/"
              className="w-full border border-border hover:bg-secondary py-3 px-4 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
