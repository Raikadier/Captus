import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api`)
      .then((res) => res.json())
      .then((data) => setMensaje(data.message))
      .catch(() => setMensaje("❌ Error al conectar con el servidor"));
  }, []);

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h1>Captus</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
