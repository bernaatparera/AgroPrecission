import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { Sprout, Menu, X } from 'lucide-react'; // Using an icon for the logo
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/farms" replace />;
  }

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/img/background_image.png')" }}
    >
      {/* Capa de oscurecimiento: degradado que oscurece más la parte derecha donde va el texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/80"></div>

      {/* Cabecera superior */}
      <header className={`sticky top-0 z-50 flex items-center justify-between p-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/10' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <img src="/pwa-icon.png" alt="AgroPrecision Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="text-2xl font-bold text-white tracking-wider drop-shadow-md">
            AgroPrecision
          </span>
        </div>
        
        {/* Enlaces escritorio */}
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors drop-shadow-md">Inicio</a>
          <span onClick={() => navigate('/nuestra-historia')} className="hover:text-white transition-colors drop-shadow-md cursor-pointer">Nuestra Historia</span>
          <span onClick={() => navigate('/servicios')} className="hover:text-white transition-colors drop-shadow-md cursor-pointer">Servicios</span>
        </nav>

        {/* Botón menú hamburguesa móvil */}
        <button 
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-200">
          <a 
            href="#" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl text-white font-medium hover:text-green-400 transition-colors"
          >
            Inicio
          </a>
          <span 
            onClick={() => { setIsMobileMenuOpen(false); navigate('/nuestra-historia'); }} 
            className="text-2xl text-white font-medium hover:text-green-400 transition-colors cursor-pointer"
          >
            Nuestra Historia
          </span>
          <span 
            onClick={() => { setIsMobileMenuOpen(false); navigate('/servicios'); }} 
            className="text-2xl text-white font-medium hover:text-green-400 transition-colors cursor-pointer"
          >
            Servicios
          </span>
          <div className="flex flex-col gap-4 mt-8 w-[80%] max-w-sm">
            <button 
              className="w-full py-3 bg-white/10 text-white rounded-lg border border-white/30"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg"
              onClick={() => navigate('/register')}
            >
              Comenzar Ahora
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal alineado a la derecha */}
      <div className="relative z-10 flex-1 flex items-center justify-end px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-2xl text-right space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
              Tus cultivos,<br/>
              <span className="text-green-400">medidos al detalle.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-md max-w-xl ml-auto leading-relaxed">
              Toma el control absoluto de tu granja. Monitoriza humedad, temperatura y salud de cada parcela en tiempo real.
            </p>
          </div>

          <div className="hidden md:flex flex-col sm:flex-row items-center justify-end gap-4 mt-8">
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 transition-all transform hover:-translate-y-1 shadow-lg"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all transform hover:-translate-y-1"
              onClick={() => navigate('/register')}
            >
              Comenzar Ahora
            </button>
          </div>
          
        </div>
      </div>

      {/* Footer minimalista */}
      <footer className="absolute bottom-6 right-6 md:right-12 lg:right-24 text-white/40 text-sm z-20 text-right">
        <p>© 2026 AgroPrecision. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
