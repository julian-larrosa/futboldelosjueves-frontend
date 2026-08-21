import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-6">
          <div className="bg-white rounded-[28px] border border-[#EBE7DF] p-8 max-w-md w-full text-center card-shadow">
            <div className="w-14 h-14 bg-[#FFEBE5] rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-[28px] text-[#C2623F]">error</span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#5A5A40] mb-2">
              Algo salio mal
            </h2>
            <p className="text-sm text-[#8D8D7E] mb-6">
              Se produjo un error inesperado. Por favor, intenta de nuevo.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs font-mono font-bold text-[#A3A395] cursor-pointer hover:text-[#5A5A40] transition-colors">
                  Detalles del error
                </summary>
                <pre className="mt-2 p-3 bg-[#F9F7F2] rounded-xl text-[11px] font-mono text-[#8D8D7E] overflow-x-auto border border-[#EBE7DF]">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all active:scale-[0.99]"
            >
              Recargar aplicacion
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
