import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch() {
    // Intentionally blank; we surface the error in render.
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          padding: 24,
          color: '#b91c1c',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          margin: 24,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0, marginBottom: 8 }}>
          Render failed
        </h1>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, margin: 0 }}>
          {this.state.message}
        </pre>
      </div>
    );
  }
}

