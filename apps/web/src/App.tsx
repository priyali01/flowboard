import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectView } from './pages/app/Project';
import { Today } from './pages/app/Today';
import { Upcoming } from './pages/app/Upcoming';
import { DashboardPage } from './pages/DashboardPage';
import { Inbox } from './pages/app/Inbox';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/inbox" replace />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/today" element={<Today />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/analytics" element={<DashboardPage />} />
                <Route path="/projects/:projectId" element={<ProjectView />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
