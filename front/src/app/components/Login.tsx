import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth, AuthUser } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Obtener Token (FastAPI espera x-www-form-urlencoded)
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const tokenRes = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!tokenRes.ok) {
        throw new Error("Credenciales inválidas");
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // 2. Obtener Perfil del Usuario
      const userRes = await fetch("http://localhost:8000/auth/me", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (!userRes.ok) throw new Error("Error obteniendo perfil");
      
      const userData: AuthUser = await userRes.json();

      // 3. Establecer Sesión
      loginSession(accessToken, userData);
      navigate('/farms');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu plataforma de gestión</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
            <Link to="/register" className="text-sm font-medium text-green-600 hover:text-green-500">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};