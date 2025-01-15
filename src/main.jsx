import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home.jsx";
import Registros from "./pages/registros/Registros.jsx";
import VerRutinaEjercicio from "./pages/verRutinasEjercicios/VerRutinaEjercicio.jsx";
import { BucketProvider } from "./context/BucketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BucketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Registros" element={<Registros />} />
          <Route path="/VerRutinaEjercicio" element={<VerRutinaEjercicio />} />
        </Routes>
      </BrowserRouter>
    </BucketProvider>
  </StrictMode>
);
