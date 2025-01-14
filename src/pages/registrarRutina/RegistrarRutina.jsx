import React from "react";
import { useNavigate } from "react-router";
import Header from "../../components/Header";
import RegistroForm from "../../components/RegistroForm";

function RegistrarRutina() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Contenedor de Rutinas */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Rutinas</h2>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto"></div>
        </div>
        <RegistroForm />
      </div>

      <div className="py-4 flex justify-center">
        <button onClick={() => navigate("/")}>Regresar</button>
      </div>
    </div>
  );
}

export default RegistrarRutina;
