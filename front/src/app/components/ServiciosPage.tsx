import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sprout, LayoutGrid, Thermometer, WifiOff, BarChart3, Menu, X } from 'lucide-react';

const services = [
  {
    icon: LayoutGrid,
    title: 'Gestión metro a metro',
    description: 'Divide tu parcela en celdas independientes y registra el estado de cada zona con precisión absoluta. Sin estimaciones, sin promedios.',
  },
  {
    icon: Thermometer,
    title: 'Monitorización ambiental',
    description: 'Consulta humedad y temperatura en tiempo real. Cada celda recibe automáticamente los datos del sensor más cercano.',
  },
  {
    icon: WifiOff,
    title: 'Funciona sin conexión',
    description: 'Registra en campo aunque no tengas cobertura. Al recuperar conexión, todo se sincroniza sin perder ningún dato.',
  },
  {
    icon: BarChart3,
    title: 'Panel de KPIs del cultivo',
    description: 'Visualiza tendencias, históricos por parcela y métricas clave para tomar decisiones fundamentadas, no basadas en intuición.',
  },
];

export const ServiciosPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/img/background_image.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/80"></div>

      <header className={`sticky top-0 z-50 flex items-center justify-between p-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/10' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/pwa-icon.png" alt="AgroPrecision Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="text-2xl font-bold text-white tracking-wider drop-shadow-md">
            AgroPrecision
          </span>
        </div>
        
        {/* Enlaces escritorio */}
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <span onClick={() => navigate('/')} className="hover:text-white transition-colors drop-shadow-md cursor-pointer">Inicio</span>
          <span onClick={() => navigate('/nuestra-historia')} className="hover:text-white transition-colors drop-shadow-md cursor-pointer">Nuestra Historia</span>
          <span className="text-white font-bold drop-shadow-md cursor-default">Servicios</span>
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
          <span 
            onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
            className="text-2xl text-white font-medium hover:text-green-400 transition-colors cursor-pointer"
          >
            Inicio
          </span>
          <span 
            onClick={() => { setIsMobileMenuOpen(false); navigate('/nuestra-historia'); }} 
            className="text-2xl text-white font-medium hover:text-green-400 transition-colors cursor-pointer"
          >
            Nuestra Historia
          </span>
          <span 
            className="text-2xl text-green-400 font-bold cursor-default"
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

      <div className="relative z-10 flex-1 flex items-center justify-end px-6 md:px-12 lg:px-24 pb-20 mt-8 md:mt-0">
        <div className="max-w-xl w-full space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg leading-tight text-right whitespace-nowrap">
            Nuestros <span className="text-green-400">Servicios</span>
          </h1>
          <div className="space-y-3">
            {services.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="bg-green-600/80 p-2 rounded-lg shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold drop-shadow-md">{title}</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 right-6 md:right-12 lg:right-24 text-white/40 text-sm z-20 text-right">
        <p>© 2026 AgroPrecision. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
