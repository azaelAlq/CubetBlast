import React from "react";
import "../../general.css";
import Header from "../../components/Header";
import EjerciciosSemana from "../../components/EjerciciosSemana";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="flex flex-col p-3 rounded gap-4 mt-5">
        <div className="flex flex-col mt-4 gap-2">
          <button>Iniciar entrenamiento</button>
          <button>Registrar entrenamiento de cardio</button>
        </div>
        <EjerciciosSemana />
        <div className="flex flex-row justify-around border border-black rounded p-3 ">
          <div className="flex flex-col  rounded justify-top px-3 py-1 w-1/2 gap-2 align-middle">
            <h3 className="text-center text-3xl font-semibold mb-3">
              Registrar
            </h3>
            <button onClick={() => navigate("/RegistrarRutina")}>
              Nueva rutina o ejercicio
            </button>
            <button onClick={() => navigate("/VerRutinaEjercicio")}>
              Ver rutinas y ejercicios
            </button>
          </div>
          <div className="flex flex-col  justify-center px-3 py-1 w-1/2 gap-2">
            <h3 className="text-center text-3xl font-semibold mb-3">
              Progress in the bucket
            </h3>
            <button>Proceso mensual</button>
            <button>Proceso anual</button>
            <button>Registro de medidas</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
