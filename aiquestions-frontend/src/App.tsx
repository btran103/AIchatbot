import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import MemoryPage from './pages/Memory';
import ProjectsPage from './pages/Projects';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat/new" element={<ChatPage mode="normal" />} />
                <Route path="/chat/study" element={<ChatPage mode="study" />} />
                <Route path="/chat/coding" element={<ChatPage mode="coding" />} />
                <Route path="/chat/english" element={<ChatPage mode="english" />} />
                <Route path="/chat/work" element={<ChatPage mode="work" />} />
                <Route path="/chat/project" element={<ChatPage mode="project" />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/memory" element={<MemoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;