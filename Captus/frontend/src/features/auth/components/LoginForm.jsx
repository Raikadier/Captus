/**
* LoginForm - Tailwind implementation (simple, semantic and accessible)
* - Usa un <form> real para evitar warnings y permitir Enter-submit
* - Placeholders nativos en vez de manejar texto de ejemplo en el estado
* - Toggle Show/Hide password opcional y simple
*/
import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const LoginForm = () => {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [showPassword, setShowPassword] = useState(false)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const [successMessage, setSuccessMessage] = useState('')

 const { login } = useAuth()
 const navigate = useNavigate()

 const handleSubmit = async (e) => {
   e.preventDefault()
   setError('')
   setSuccessMessage('')
   setLoading(true)

   try {
     const result = await login(email, password)
     if (result.success) {
       navigate('/home')
     } else {
       setError(result.error)
     }
   } catch {
     setError('An unexpected error occurred')
   } finally {
     setLoading(false)
   }
 }

 return (
   <div
     className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
     style={{
       backgroundImage: `url('/fondLogin.png')`,
       backgroundColor: '#f5f5f5', // fallback color
     }}
   >
     {/* Logo superior */}
     <div className="absolute top-8 left-1/2 -translate-x-1/2">
       <img src="/iconUserGrn.png" alt="User Icon" className="w-24 h-24" />
     </div>

     {/* Card principal */}
     <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
       {/* Banners (conservados) */}
       <div className="mb-6">
         <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded mb-2" />
         <img src="/banner.png" alt="Banner" className="w-full h-16 object-cover rounded" />
       </div>

       <h1 className="text-center text-xl font-bold text-gray-700 mb-6">Get Started</h1>

       {/* Formulario semántico */}
       <form className="space-y-5" onSubmit={handleSubmit}>
         {/* Email */}
         <div>
           <label htmlFor="email" className="sr-only">
             Email
           </label>
           <input
             id="email"
             name="email"
             type="email"
             autoComplete="email"
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="User Name"
             className="w-full px-4 py-3 bg-gray-100 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
           />
         </div>

         {/* Password + toggle */}
         <div>
           <label htmlFor="password" className="sr-only">
             Password
           </label>
           <div className="relative">
             <input
               id="password"
               name="password"
               type={showPassword ? 'text' : 'password'}
               autoComplete="current-password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Type Your Password"
               className="w-full px-4 py-3 bg-gray-100 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-20"
             />
             <button
               type="button"
               onClick={() => setShowPassword((s) => !s)}
               className="absolute inset-y-0 right-2 my-auto px-2 text-sm text-gray-600 hover:text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
               aria-label={showPassword ? 'Hide password' : 'Show password'}
             >
               {showPassword ? 'Hide' : 'Show'}
             </button>
           </div>
         </div>

         {/* Mensajes */}
         {error && <div className="text-red-600 text-sm text-center">{error}</div>}
         {successMessage && <div className="text-green-600 text-sm text-center">{successMessage}</div>}

         {/* Acciones */}
         <div className="flex justify-center">
           <button
             type="submit"
             disabled={loading}
             className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
           >
             {loading ? 'Logging in...' : 'Login'}
           </button>
         </div>
       </form>

       {/* Registro */}
       <div className="text-center text-sm mt-4">
         <span className="text-gray-600">New user? </span>
         <Link to="/register" className="text-green-600 font-bold hover:underline">
           Register Here
         </Link>
       </div>
     </div>
   </div>
 )
}

export default LoginForm