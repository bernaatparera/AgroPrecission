import React from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';

export const Layout = () => {
  const { user, logout, isLoading } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  if (isPublicRoute) {
    return <Outlet />;
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col${isDark ? ' dark' : ''}`}>
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/farms'}>
                <img src="/pwa-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold text-foreground tracking-tight">AgroPrecision</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={isDark ? 'Modo claro' : 'Modo noche'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div
                onClick={() => navigate('/perfil')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border text-sm font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
              >
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                {user?.nombre} {user?.apellidos}
              </div>
              <button
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};
