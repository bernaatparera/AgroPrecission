import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Moon, Sun, Menu, X } from 'lucide-react';

export const Layout = () => {
  const { user, logout, isLoading } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  if (user && isPublicRoute) {
    return <Navigate to="/farms" replace />;
  }

  if (!user && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  if (isPublicRoute) {
    return <Outlet />;
  }

  const closeMenuAndNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const closeMenuAndLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col${isDark ? ' dark' : ''}`}>
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/farms'}>
                <img src="/pwa-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold text-foreground tracking-tight">AgroPrecision</span>
              </div>
            </div>
            
            {/* Controles de Escritorio */}
            <div className="hidden sm:flex items-center gap-2">
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

            {/* Menú Hamburguesa para Móvil */}
            <div className="flex sm:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-card absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <div className="px-3 py-3 border-b border-border flex items-center gap-3">
                <div className="bg-accent p-2 rounded-full">
                  <UserIcon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.nombre} {user?.apellidos}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggle(); }}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg mt-2"
              >
                {isDark ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
                {isDark ? 'Modo claro' : 'Modo oscuro'}
              </button>

              <button
                onClick={() => closeMenuAndNavigate('/perfil')}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg"
              >
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                Mi Perfil
              </button>

              <button
                onClick={closeMenuAndLogout}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg mt-2"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};
