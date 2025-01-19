import React, { useState, useEffect } from "react";
import { BucketContext } from "../../context/BucketContext";
import Header from "../../components/Header";
import { useNavigate } from "react-router";
import { supabase } from "../../supabase/client";
import { EjercicioContext } from "../../context/EntrenamientoContext";

function IniciarEntrenamiento() {
  const navigate = useNavigate();

  const { ejercicios, cargando, rutinas, getEjercicios, getRutinas } =
    React.useContext(BucketContext);

  const [filtro, setFiltro] = useState("");
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

  const {
    setBolUltimoEntreno,
    SetultimoEntrenamiento,
    setEntrenamientoActual,
    crearEntrenamiento,
    setRutina,
    getEjercicios: getEjerciciosEntrenamiento,
  } = React.useContext(EjercicioContext);

  useEffect(() => {
    getEjerciciosEntrenamiento();
    getEjercicios();
    getRutinas();
  }, []);

  const handleBusqueda = (event) => {
    setFiltro(event.target.value.toLowerCase());
  };

  const renderRutinas = () => {
    const rutinasFiltradas = rutinas.filter((rutina) =>
      rutina.Nombre.toLowerCase().includes(filtro)
    );

    if (cargando) {
      return <p className="text-center text-gray-500">Cargando Rutinas...</p>;
    } else if (rutinasFiltradas.length === 0) {
      return (
        <p className="text-center text-gray-500">No hay rutinas registradas</p>
      );
    } else {
      return rutinasFiltradas.map((rutina) => (
        <div
          key={rutina.id}
          className="p-4 bg-white shadow rounded-md mb-4 flex flex-col"
        >
          <h3 className="text-lg font-bold">{"Rutina: " + rutina.Nombre}</h3>
          <div className="p-4  shadow rounded-md mb-4 bg-slate-100 mt-3">
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
                  {ejercicio}
                </div>
              ))}
            </div>
          </div>
          <button
            className=" text-white px-4 py-2 rounded shadow"
            onClick={() => {
              seleccionarRutina(rutina);
            }}
          >
            Seleccionar
          </button>
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

  const seleccionarRutina = (rutina) => {
    setRutinaSeleccionada(rutina);
    SetultimoEntrenamiento({});
    setBolUltimoEntreno(false);
    setEntrenamientoActual({});

    setRutina(rutina);
  };

  const Inicializar = async () => {
    try {
      const { data, error } = await supabase
        .from("Entrenamientos")
        .select("*")
        .eq("IdRutina", rutinaSeleccionada.id)
        .order("Fecha", { ascending: false });

      if (error) {
        console.error("Error al obtener datos de la BD:", error);
        alert("Error en la BD: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        setBolUltimoEntreno(false);
        SetultimoEntrenamiento({});
      } else {
        setBolUltimoEntreno(true);
        SetultimoEntrenamiento(data[0]);
      }

      navigate("/Entrenamiento");
    } catch (err) {
      console.error("Error en el código:", err);
      alert("Error en el código: " + err.message);
    }
    crearEntrenamiento(rutinaSeleccionada.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Contenedor de Rutinas */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Rutinas</h2>
          <input
            type="text"
            placeholder="Buscar rutina..."
            value={filtro}
            onChange={handleBusqueda}
            className="w-full p-2 mb-4 border rounded shadow"
          />
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {renderRutinas()}
          </div>
        </div>
        {/* Contenedor de Ejercicios */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <div className=" flex flex-col gap-2 justify-center mt-[150px] bg-slate-100 p-3 rounded-sm">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Rutina seleccionada:
            </h2>
            <div>
              {rutinaSeleccionada ? (
                <>
                  <div>
                    <p>
                      <strong>ID:</strong> {rutinaSeleccionada.id}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {rutinaSeleccionada.Nombre}
                    </p>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {rutinaSeleccionada.Descripcion}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  No has seleccionado ninguna rutina
                </p>
              )}
            </div>
            <button
              className={`mt-4 text-white px-4 py-2 rounded shadow ${
                rutinaSeleccionada ? "" : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!rutinaSeleccionada}
              onClick={() => Inicializar()}
            >
              Iniciar entrenamiento
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-red-500 text-white px-4 py-2 rounded shadow"
            >
              Regresar
            </button>
          </div>
        </div>
      </div>
      <div className="py-4 flex justify-center"></div>
    </div>
  );
}

export default IniciarEntrenamiento;
