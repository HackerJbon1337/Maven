import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import GenericPage from './pages/GenericPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/portal"    element={<ProtectedRoute element={<PortalPage />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          
          {/* Helper footer pages */}
          <Route path="/about"     element={<GenericPage title="ABOUT MAVEN" />} />
          <Route path="/contact"   element={<GenericPage title="COMMAND COMM-LINK" />} />
          <Route path="/legal"     element={<GenericPage title="LEGAL DIRECTIVES" />} />
          <Route path="/links"     element={<GenericPage title="SYSTEM LINKS" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
