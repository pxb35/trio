import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logCrash(error, errorInfo); // 🔗 store crash info
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please refresh the page.</h2>;
    }
    return this.props.children;
  }
}

function logCrash(error, errorInfo) {
    
    gtag('event', 'errors_logged', {
        event_category: 'Errors',
        event_label: 'Errors Logged',
        value: 1
    });

  const crashReport = {
    timestamp: new Date().toISOString(),
    message: error?.message || 'Unknown error',
    stack: error?.stack || 'No stack trace',
    componentStack: errorInfo?.componentStack || 'No component stack',
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  const existing = JSON.parse(localStorage.getItem('swoopCrashLogs') || '[]');
  existing.push(crashReport);
  localStorage.setItem('swoopCrashLogs', JSON.stringify(existing));

  console.error('🧨 Crash logged to localStorage:', crashReport);
}
