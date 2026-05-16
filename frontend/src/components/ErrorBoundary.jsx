import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-coral/20 max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-coral/10 text-coral rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Something went wrong</h1>
            <p className="text-[#8B8FA8] mb-6 text-sm">
              We're sorry, but the application crashed. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-iris text-white font-medium hover:bg-iris/90 transition-colors shadow-soft"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
