import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estados para manejar usuario, token y carga
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configurar el token en axios cuando cambie
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar si hay sesión activa al cargar la app
    useEffect(() => {
      const verificarSesion = async () => {
        // Modo demo: habilitar navegación completa sin backend
        const DEMO = true;
        if (DEMO) {
          setUser({ id: 'demo-user', user_metadata: { name: 'Usuario Demo' } });
          setLoading(false);
          return;
        }
   
        const tokenGuardado = localStorage.getItem('token');
        if (tokenGuardado) {
          try {
            // Verificar el token con el backend
            const response = await axios.get('/api/auth/verify', {
              headers: { Authorization: `Bearer ${tokenGuardado}` }
            });
            setToken(tokenGuardado);
            setUser(response.data.user);
          } catch (error) {
            // Si el token no es válido, limpiar
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        }
        setLoading(false);
      };
   
      verificarSesion();
    }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    // Modo demo: simular login exitoso y habilitar navegación
    const DEMO = true;
    if (DEMO) {
      const token = 'demo-token';
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ id: 'demo-user', user_metadata: { name: 'Usuario Demo' }, email });
      return { success: true };
    }
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;

      // Guardar usuario y token
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  };

  // Función para registrar nuevo usuario
  const register = async (email, password, name) => {
    // Modo demo: simular registro y sesión activa
    const DEMO = true;
    if (DEMO) {
      const token = 'demo-token';
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ id: 'demo-user', user_metadata: { name: name || 'Usuario Demo' }, email });
      return { success: true, requiresEmailConfirmation: false };
    }
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        name
      });
      const { user, session } = response.data;

      if (session) {
        // Si hay sesión, hacer login automático
        const loginResponse = await axios.post('/api/auth/login', { email, password });
        const { token } = loginResponse.data;

        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
      }

      return {
        success: true,
        requiresEmailConfirmation: !session
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrarse'
      };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    // Modo demo: limpiar estado local sin llamar backend
    const DEMO = true;
    if (DEMO) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      return;
    }
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado y localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  // Valores que se compartirán en el contexto
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};