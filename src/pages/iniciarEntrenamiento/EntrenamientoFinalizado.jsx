import React, { useState } from "react";
import { EjercicioContext } from "../../context/EntrenamientoContext";
import Header from "../../components/Header";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router";

function EntrenamientoFinalizado() {
  const navigate = useNavigate();
  const {
    tiempoCronometro,
    rendimientoSubir,
    formatearTiempo,
    rendimientoAnterior,
    ejercicios,
    rutina,
  } = React.useContext(EjercicioContext);

  const [nota, setNota] = useState("");
  const [mejoraTexto, setMejoraTexto] = useState("");

  const getNombreEjercicio = (id) => {
    const ejercicio = ejercicios.find((e) => e.id === id);
    return ejercicio ? ejercicio.Nombre : "Desconocido";
  };

  const handleGuardarDatos = async () => {
    if (!nota || isNaN(nota) || nota < 1 || nota > 10) {
      alert("Por favor, ingresa una nota válida entre 1 y 10.");
      return;
    }

    try {
      const idsEjerciciosGuardados = [];

      // Guardar cada ejercicio de forma separada
      for (const ejercicio of rendimientoSubir) {
        const { idEjercicio, peso, reps } = ejercicio;

        const { data, error } = await supabase
          .from("Ejercicios")
          .insert([
            {
              IdNomEjer: idEjercicio, // ID del ejercicio
              Peso: peso,
              Reps: reps,
            },
          ])
          .select();

        if (error) {
          console.error("Error al guardar el ejercicio:", error);
          alert("Ocurrió un error al guardar los ejercicios.");
          return;
        }

        // Guardar el ID generado para cada ejercicio
        idsEjerciciosGuardados.push(data[0].id);
      }

      console.log(idsEjerciciosGuardados);
      // Ahora crear los datos del entrenamiento, incluyendo los IDs de los ejercicios guardados
      const datosEntrenamiento = {
        IdRutina: rutina.id,
        Rendimiento: idsEjerciciosGuardados,
        MejoText: mejoraTexto.trim(),
        NotaNum: parseFloat(nota),
        Duracion: formatearTiempo(tiempoCronometro),
      };

      console.log("Datos a guardar en la BD:", datosEntrenamiento);

      // Ejemplo para insertar los datos del entrenamiento en Supabase:

      const { data, error: entrenamientoError } = await supabase
        .from("Entrenamientos")
        .insert([datosEntrenamiento]);

      if (entrenamientoError) {
        console.error("Error al guardar el entrenamiento:", entrenamientoError);
        alert("Ocurrió un error al guardar el entrenamiento.");
        return;
      }

      alert(
        "Datos del entrenamiento guardados con exito. regresando a la pagina principal"
      );

      navigate("/");
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      alert("Ocurrió un error al procesar los datos del entrenamiento.");
    }
  };
  return (
    <div className="  ">
      <Header />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-2">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Entrenamiento Finalizado
        </h1>
        <p className="text-lg mb-6 text-center">
          Tardaste en realizar la rutina <strong>{rutina.Nombre}</strong> en{" "}
          {formatearTiempo(tiempoCronometro)} minutos.
        </p>

        <h2 className="text-xl font-semibold mb-4">
          Comparación de Rendimiento
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Ejercicio</th>
                <th className="border border-gray-300 px-4 py-2 bg-red-800">
                  Peso Anterior
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-green-800">
                  Reps Anteriores
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-red-800">
                  Peso Actual
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-green-800">
                  Reps Actuales
                </th>
              </tr>
            </thead>
            <tbody>
              {rendimientoSubir.map((rendimiento, index) => {
                const anterior = rendimientoAnterior[index];
                return (
                  <tr key={rendimiento.idEjercicio}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {getNombreEjercicio(rendimiento.idEjercicio)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center bg-red-50">
                      {anterior?.peso || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center bg-green-50">
                      {anterior?.reps || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center bg-red-50">
                      {rendimiento.peso}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center bg-green-50">
                      {rendimiento.reps}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-lg">
            Nota del entrenamiento (1-10):
          </label>
          <input
            type="number"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="border border-gray-400 rounded p-2 w-full text-lg"
            min="1"
            max="10"
          />

          <label className="block mt-4 mb-2 text-lg">Mejora sugerida:</label>
          <textarea
            value={mejoraTexto}
            onChange={(e) => setMejoraTexto(e.target.value)}
            className="border border-gray-400 rounded p-2 w-full text-lg"
          ></textarea>

          <button
            onClick={handleGuardarDatos}
            className="bg-green-500 text-white p-3 mt-6 rounded w-full text-lg font-semibold"
          >
            Guardar Datos
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntrenamientoFinalizado;
