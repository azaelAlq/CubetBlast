import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home.jsx";
import Registros from "./pages/registros/Registros.jsx";
import IniciarEntrenamiento from "./pages/iniciarEntrenamiento/IniciarEntrenamiento.jsx";
import Entrenamiento from "./pages/iniciarEntrenamiento/Entrenamiento.jsx";
import VerRutinaEjercicio from "./pages/verRutinasEjercicios/VerRutinaEjercicio.jsx";
import { BucketProvider } from "./context/BucketContext.jsx";
import { EjercicioProvider } from "./context/EntrenamientoContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Contexto global */}
    <BucketProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas sin contexto específico */}
          <Route path="/" element={<Home />} />
          <Route path="/Registros" element={<Registros />} />
          <Route path="/VerRutinaEjercicio" element={<VerRutinaEjercicio />} />

          {/* Agrupación de rutas con EjercicioProvider */}
          <Route
            path="/IniciarEntrenamiento"
            element={
              <EjercicioProvider>
                <IniciarEntrenamiento />
              </EjercicioProvider>
            }
          />
          <Route
            path="/Entrenamiento"
            element={
              <EjercicioProvider>
                <Entrenamiento />
              </EjercicioProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </BucketProvider>
  </StrictMode>
);
