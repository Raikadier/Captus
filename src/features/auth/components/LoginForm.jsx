// LoginForm - Equivalente a frmLogin.cs
// Formulario de inicio de sesión con placeholders que desaparecen al enfocarse
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AcademicFooter from '../../../shared/components/AcademicFooter';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Nombre de usuario');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Ingrese su contraseña');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleEmailFocus = () => {
    if (email === 'Nombre de usuario') {
      setEmail('');
      setEmailPlaceholder('');
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() === '') {
      setEmail('Nombre de usuario');
      setEmailPlaceholder('Nombre de usuario');
    }
  };

  const handlePasswordFocus = () => {
    if (password === 'Ingrese su contraseña') {
      setPassword('');
      setPasswordPlaceholder('');
      setShowPassword(true);
    }
  };

  const handlePasswordBlur = () => {
    if (password.trim() === '') {
      setShowPassword(false);
      setPassword('Ingrese su contraseña');
      setPasswordPlaceholder('Ingrese su contraseña');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    navigate('/home');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cover bg-center relative"
         style={{
           backgroundImage: `url('/fondLogin.png')`,
           backgroundColor: '#f5f5f5' // fallback color
         }}>

      {/* Logo en la parte superior */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <img src="/iconUserGrn.png" alt="Ícono de usuario" className="w-24 h-24" />
      </div>

      {/* Formulario principal de login */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
        {/* Imágenes de banner */}
        <div className="mb-6">
          <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded mb-2" />
          <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded" />
        </div>

        {/* Título */}
        <h1 className="text-center text-xl font-bold text-gray-700 mb-6">
          Comience
        </h1>

        {/* Campo de usuario/correo */}
        <div className="mb-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={emailPlaceholder}
          />
        </div>

        {/* Campo de contraseña */}
        <div className="mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={passwordPlaceholder}
          />
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="text-green-600 text-sm text-center mb-4">
            {successMessage}
          </div>
        )}

        {/* Botón de inicio de sesión */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Enlace de registro */}
        <div className="text-center text-sm">
          <span className="text-gray-600">¿Nuevo usuario? </span>
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Regístrese aquí
          </Link>
        </div>
      </div>
      <AcademicFooter />
    </div>
  );
};

export default LoginForm;