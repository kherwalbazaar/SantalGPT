'use client';

import App from '../src/App';
import ErrorBoundary from '../src/ErrorBoundary';

export default function AppShell() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
