import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home.jsx";
import Registros from "./pages/registros/Registros.jsx";
import IniciarEntrenamiento from "./pages/iniciarEntrenamiento/IniciarEntrenamiento.jsx";
import VerRutinaEjercicio from "./pages/verRutinasEjercicios/VerRutinaEjercicio.jsx";
import { BucketProvider } from "./context/BucketContext.jsx";
import Entrenamiento from "./pages/iniciarEntrenamiento/Entrenamiento.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BucketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Registros" element={<Registros />} />
          <Route path="/VerRutinaEjercicio" element={<VerRutinaEjercicio />} />
          <Route
            path="/IniciarEntrenamiento"
            element={<IniciarEntrenamiento />}
          />
        </Routes>
      </BrowserRouter>
    </BucketProvider>
  </StrictMode>
);
