import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import AdminPage from './components/admin/AdminPage.tsx';

const resolveIsAdminRoute = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const cleanPath = window.location.pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  const hostname = window.location.hostname;
  const isGitHubPages = /\.github\.io$/i.test(hostname);

  if (!isGitHubPages) {
    return segments.length === 1 && segments[0] === 'admin';
  }

  const isRootUserPage = hostname === 'tribe-alsayahin.github.io';

  if (isRootUserPage) {
    return segments.length === 1 && segments[0] === 'admin';
  }

  return segments.length === 2 && segments[1] === 'admin';
};

const RootComponent = resolveIsAdminRoute() ? AdminPage : App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RootComponent />
    </ErrorBoundary>
  </StrictMode>,
);
