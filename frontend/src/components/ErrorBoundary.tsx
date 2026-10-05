import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui";
import { LogoMark } from "./Logo";

interface Props {
  children: React.ReactNode;
  // Where the "Go to dashboard" link should point. Defaults to the landing page
  // because that is the one URL every signed-out and signed-in user can open.
  home?: string;
  // Shown above the fallback title, so a per-route boundary can say which area
  // crashed without the fallback having to know the route.
  scope?: string;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time exceptions so one bad component does not blank the whole
 * app. React does not have a hook equivalent, which is why this stays a class.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // The componentStack is what makes an anonymous "Cannot read properties of
    // undefined" findable; without it the only clue is a minified call site.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    const home = this.props.home ?? "/";
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-5 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-6 flex items-center gap-3">
            <LogoMark size={42} />
            <span>
              <span className="block font-display text-lg leading-none text-text">NyaySetu</span>
              <span className="block font-ui text-2xs leading-tight text-muted">न्यायसेतु</span>
            </span>
          </div>

          <div className="panel p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                <AlertTriangle size={19} />
              </span>
              <div className="min-w-0">
                {this.props.scope && (
                  <p className="font-ui text-2xs font-semibold uppercase tracking-wider text-faint">
                    {this.props.scope}
                  </p>
                )}
                <h1 className="font-display text-xl leading-tight text-text">
                  Something went wrong on this screen
                </h1>
                <p className="mt-1.5 font-ui text-xs leading-relaxed text-muted">
                  The page could not finish rendering. The rest of the app is still working.
                </p>
                {this.state.error.message && (
                  <p className="mt-2 break-words font-mono text-2xs text-faint">
                    {this.state.error.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                icon={<RefreshCw size={14} />}
                onClick={() => {
                  this.reset();
                  window.location.reload();
                }}
              >
                Reload
              </Button>
              <Link
                to={home}
                onClick={this.reset}
                className="inline-flex items-center justify-center rounded-card border border-border px-4 py-2 font-ui text-xs font-medium text-text hover:bg-surface-raised"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
