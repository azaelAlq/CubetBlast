import React from "react";
import { BucketContext } from "../../context/BucketContext";
import Header from "../../components/Header";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function VerRutinaEjercicio() {
  const navigate = useNavigate();
  const { ejercicios, cargando, rutinas, getEjercicios, getRutinas } =
    React.useContext(BucketContext);

  useEffect(() => {
    getEjercicios();
    getRutinas();
  }, []);

  const renderEjercicios = () => {
    if (cargando) {
      return (
        <p className="text-center text-gray-500">Cargando Ejercicios...</p>
      );
    } else if (ejercicios.length === 0) {
      return (
        <p className="text-center text-gray-500">
          No hay ejercicios registrados
        </p>
      );
    } else {
      return ejercicios.map((ejercicio) => (
        <div key={ejercicio.id} className="p-4 bg-white shadow rounded-md">
          <h3 className="text-lg font-bold">{ejercicio.Nombre}</h3>
          <p>{"Tipo de agarre: " + ejercicio.TipAgarre}</p>
          <p>{"Material: " + ejercicio.Material}</p>
        </div>
      ));
    }
  };

  const renderRutinas = () => {
    if (cargando) {
      return <p className="text-center text-gray-500">Cargando Rutinas...</p>;
    } else if (rutinas.length === 0) {
      return (
        <p className="text-center text-gray-500">No hay rutinas registradas</p>
      );
    } else {
      return rutinas.map((rutina) => (
        <div key={rutina.id} className="p-4 bg-white shadow rounded-md mb-4">
          <h3 className="text-lg font-bold">{"Rutina: " + rutina.Nombre}</h3>
          <div className="p-4 bg-white shadow rounded-md mb-4">
            <h3 className="text-sm font text-gray-600">
              <strong>Descripción: </strong>
              {rutina.Descripcion}
            </h3>
            <div className="mt-2 flex flex-wrap gap-4">
              {verRutina(rutina.Ejercicios).map((ejercicio, index) => (
                <div
                  key={index}
                  className="bg-slate-400 text-gray-800 px-4 py-2 rounded-lg shadow-sm"
                >
                  {}
                  {ejercicio}
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    }
  };

  const verRutina = (arreglo) => {
    let ejerciciosRutina = [];
    for (let i = 0; i < arreglo.length; i++) {
      for (let j = 0; j < ejercicios.length; j++) {
        if (arreglo[i] === ejercicios[j].id) {
          ejerciciosRutina.push(ejercicios[j].Nombre);
        }
      }
    }
    return ejerciciosRutina;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Contenedor de Ejercicios */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Ejercicios
          </h2>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {renderEjercicios()}
          </div>
        </div>

        {/* Contenedor de Rutinas */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Rutinas</h2>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {renderRutinas()}
          </div>
        </div>
      </div>

      <div className="py-4 flex justify-center">
        <button onClick={() => navigate("/")}>Regresar</button>
      </div>
    </div>
  );
}

export default VerRutinaEjercicio;
