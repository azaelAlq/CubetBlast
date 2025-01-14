import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home.jsx";
import RegistrarRutina from "./pages/registrarRutina/RegistrarRutina.jsx";
import VerRutinaEjercicio from "./pages/home/verRutinasEjercicios/VerRutinaEjercicio.jsx";
import { BucketProvider } from "./context/BucketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BucketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegistrarRutina" element={<RegistrarRutina />} />
          <Route path="/VerRutinaEjercicio" element={<VerRutinaEjercicio />} />
        </Routes>
      </BrowserRouter>
    </BucketProvider>
  </StrictMode>
);
