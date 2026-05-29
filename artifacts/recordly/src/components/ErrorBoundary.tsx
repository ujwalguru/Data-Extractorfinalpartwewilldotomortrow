import { Component, type ReactNode } from "react";

interface Props {
        children: ReactNode;
}

interface State {
        error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
        constructor(props: Props) {
                super(props);
                this.state = { error: null };
        }

        static getDerivedStateFromError(error: Error): State {
                return { error };
        }

        render() {
                if (this.state.error) {
                        return (
                                <div className="flex h-screen w-full items-center justify-center bg-neutral-950 p-6">
                                        <div className="flex max-w-lg flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                                                <div className="text-base font-semibold text-white">Something went wrong</div>
                                                <pre className="max-h-48 overflow-auto rounded-lg bg-black/40 p-3 text-left text-xs text-red-400">
                                                        {this.state.error.message}
                                                        {"\n\n"}
                                                        {this.state.error.stack}
                                                </pre>
                                                <button
                                                        type="button"
                                                        onClick={() => window.location.reload()}
                                                        className="mx-auto rounded-lg bg-neutral-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-600"
                                                >
                                                        Reload
                                                </button>
                                        </div>
                                </div>
                        );
                }
                return this.props.children;
        }
}
