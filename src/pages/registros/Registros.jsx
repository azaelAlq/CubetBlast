import React from "react";
import { useNavigate } from "react-router";
import Header from "../../components/Header";
import RegistroEjercicios from "../../components/RegistroEjercicios";
import RegistroRutinas from "../../components/RegistroRutinas";
import { BucketContext } from "../../context/BucketContext";
import { useEffect } from "react";

function RegistrarRutina() {
  const navigate = useNavigate();
  const { getEjercicios, getRutinas } = React.useContext(BucketContext);
  useEffect(() => {
    getEjercicios();
    getRutinas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <RegistroRutinas />
        <RegistroEjercicios />
      </div>

      <div className="py-4 flex justify-center">
        <button onClick={() => navigate("/")}>Regresar</button>
      </div>
    </div>
  );
}

export default RegistrarRutina;
