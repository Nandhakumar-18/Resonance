import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen w-full bg-black text-white p-4">
          <div className="text-center">
            <h1 className="text-2xl font-light text-red-400 mb-2">Signal Lost</h1>
            <p className="text-gray-400">An unexpected error disrupted the connection.</p>
            <button 
              className="mt-4 px-4 py-2 border border-gray-700 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
