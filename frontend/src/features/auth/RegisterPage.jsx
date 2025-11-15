import React, { useState } from 'react';
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "estudiante",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    // 1. Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role: form.role, // Esto guarda el rol en user_metadata
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Registro exitoso. Por favor revisa tu correo para confirmar.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Registro</h1>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* SELECT DEL ROL */}
        <select
          name="role"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        >
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm text-center">{successMsg}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
