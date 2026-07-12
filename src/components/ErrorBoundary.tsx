'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

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

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('خطأ في التطبيق:', error, info.componentStack);
  }

  render() {
    const state = this.state as State;
    const props = this.props as Props;

    if (state.hasError) {
      return (
        <div
          data-app-ready="true"
          dir="rtl"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            background: 'radial-gradient(ellipse at 50% 0%, #101824 0%, #0c0905 45%, #070503 100%)',
            color: '#fcf8f0',
            fontFamily: "'Tajawal', sans-serif",
            textAlign: 'center',
            padding: '24px',
          }}
        >
          {/* Al-Bab emblem */}
          <svg width="56" height="56" viewBox="0 0 200 200" fill="none" stroke="#d4af37" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
            <path d="M55 170 V50 H145 V170" />
          </svg>

          <h1 style={{ fontFamily: "'Amiri', serif", color: '#ebd481', fontSize: '26px', fontWeight: 700 }}>
            قبيلة السياحين
          </h1>

          <p style={{ color: '#bba989', maxWidth: '360px', lineHeight: 1.8 }}>
            حدث خطأ أثناء تحميل الصفحة. يُرجى تحديث المتصفح للمحاولة مجدداً.
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '8px',
              padding: '12px 28px',
              background: 'transparent',
              border: '1px solid #d4af37',
              borderRadius: '8px',
              color: '#d4af37',
              fontFamily: "'Tajawal', sans-serif",
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return props.children;
  }
}
