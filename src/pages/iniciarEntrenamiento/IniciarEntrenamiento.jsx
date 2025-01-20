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
    iniciarCronometro,
    crearEntrenamiento,
    setRutina,
    getEjercicios: getEjerciciosEntrenamiento,
    valorRendimientoActual,
    SetultimoEntrenamiento,

    ultimoEntrenamiento,
    setNumEjercicio,
    setDatoCambia,
    setRendimientoSubir,
    setRendimientoAnterior,
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
    setRutina(rutina);
  };

  const Inicializar = async () => {
    try {
      let bolEntrenamiento = false;
      // Reiniciar valores antes de cargar la nueva rutina
      SetultimoEntrenamiento({});
      setNumEjercicio(0);
      setRendimientoSubir([]);
      setRendimientoAnterior([]);
      setDatoCambia({
        pesoActual: "",
        pesoAnterior: 0,
        repeticionesActual: "",
        repeticionesAnteriores: 0,
        preparacion: "",
        nombreEjercicio: "",
        agarre: "",
        material: "",
        nota: "",
        imagen: "",
      });

      // Obtener datos del último entrenamiento
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

      const pasos = rutinaSeleccionada.Preparacion.join("\n"); // Une los pasos con un salto de línea

      if (data.length === 0) {
        SetultimoEntrenamiento({});
        alert(
          `No hay entrenamiento anterior para cargar, registra todo bien.\n\nPasos a seguir:\n${pasos}`
        );
        // Configurar el primer ejercicio
        const primerEjercicio = rutinaSeleccionada.Ejercicios[0];

        const rendimientoAnteriorPrimer = bolEntrenamiento
          ? data[0]?.Rendimiento.find(
              (item) => item.idEjercicio === primerEjercicio
            ) || { peso: 0, reps: 0 }
          : { peso: 0, reps: 0 }; // Valores predeterminados si no hay datos previos

        setDatoCambia({
          pesoActual: "",
          pesoAnterior: rendimientoAnteriorPrimer.peso || 0,
          repeticionesActual: "",
          repeticionesAnteriores: rendimientoAnteriorPrimer.reps || 0,
          preparacion: "",
          nombreEjercicio:
            ejercicios.find((e) => e.id === primerEjercicio)?.Nombre || "",
          agarre:
            ejercicios.find((e) => e.id === primerEjercicio)?.TipAgarre || "",
          material:
            ejercicios.find((e) => e.id === primerEjercicio)?.Material || "",
          nota:
            ejercicios.find((e) => e.id === primerEjercicio)?.NotaRealizacion ||
            "",
          imagen:
            ejercicios.find((e) => e.id === primerEjercicio)?.URLvideo || "",
        });
        valorRendimientoActual(bolEntrenamiento);
      } else {
        let primerPeso = 0;
        let primerRep = 0;
        alert(
          `Tienes un entrenamiento anterior, la nota es:.\n\nPasos a seguir:\n${pasos}`
        );
        bolEntrenamiento = true;

        SetultimoEntrenamiento(data[0]);
        try {
          const { data: primerejercicio, error } = await supabase
            .from("Ejercicios")
            .select("*")
            .eq("id", data[0].Rendimiento[0]);
          primerPeso = primerejercicio[0].Peso;
          primerRep = primerejercicio[0].Reps;
          if (error) {
            console.log("Error al obtener datos de la BD:", error);
          }
        } catch (error) {
          console.error("Error en el código:", error);
          alert("Error en el código: " + error.message);
        }

        // Configurar el primer ejercicio cuando hay coso
        const primerEjercicio = rutinaSeleccionada.Ejercicios[0];
        const rendimientoAnteriorPrimer = bolEntrenamiento
          ? data[0]?.Rendimiento.find(
              (item) => item.idEjercicio === primerEjercicio
            ) || { peso: primerPeso, reps: primerRep }
          : { peso: 77, reps: 77 }; // Valores predeterminados si no hay datos previos
        setDatoCambia({
          pesoActual: "",
          pesoAnterior: rendimientoAnteriorPrimer.peso || 0,
          repeticionesActual: "",
          repeticionesAnteriores: rendimientoAnteriorPrimer.reps || 0,
          preparacion: "",
          nombreEjercicio:
            ejercicios.find((e) => e.id === primerEjercicio)?.Nombre || "",
          agarre:
            ejercicios.find((e) => e.id === primerEjercicio)?.TipAgarre || "",
          material:
            ejercicios.find((e) => e.id === primerEjercicio)?.Material || "",
          nota:
            ejercicios.find((e) => e.id === primerEjercicio)?.NotaRealizacion ||
            "",
          imagen:
            ejercicios.find((e) => e.id === primerEjercicio)?.URLvideo || "",
        });
        valorRendimientoActual(bolEntrenamiento, data[0].Rendimiento);
      }

      // Iniciar cronómetro al empezar el entrenamiento
      iniciarCronometro();

      // Inicializar el rendimiento actual y navegar
      navigate("/Entrenamiento");
      crearEntrenamiento(rutinaSeleccionada.id);
    } catch (err) {
      console.error("Error en el código:", err);
      alert("Error en el código: " + err.message);
    }
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
