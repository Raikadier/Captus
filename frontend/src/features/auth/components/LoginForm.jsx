// LoginForm - Equivalent to frmLogin.cs
// Login form with placeholders that disappear on click
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AcademicFooter from '../../../shared/components/AcademicFooter';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('User Name');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Type Your Password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleEmailFocus = () => {
    if (email === 'User Name') {
      setEmail('');
      setEmailPlaceholder('');
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() === '') {
      setEmail('User Name');
      setEmailPlaceholder('User Name');
    }
  };

  const handlePasswordFocus = () => {
    if (password === 'Type Your Password') {
      setPassword('');
      setPasswordPlaceholder('');
      setShowPassword(true);
    }
  };

  const handlePasswordBlur = () => {
    if (password.trim() === '') {
      setShowPassword(false);
      setPassword('Type Your Password');
      setPasswordPlaceholder('Type Your Password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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

      {/* Logo at top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <img src="/iconUserGrn.png" alt="User Icon" className="w-24 h-24" />
      </div>

      {/* Main login form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
        {/* Banner images */}
        <div className="mb-6">
          <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded mb-2" />
          <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded" />
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-bold text-gray-700 mb-6">
          Get Started
        </h1>

        {/* Email input */}
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

        {/* Password input */}
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

        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="text-green-600 text-sm text-center mb-4">
            {successMessage}
          </div>
        )}

        {/* Login button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Register link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">New user? </span>
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
      <AcademicFooter />
    </div>
  );
};

export default LoginForm;