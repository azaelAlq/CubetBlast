import React, { useState } from "react";
import { BucketContext } from "../context/BucketContext";

function RegistroRutinas() {
  const { ejercicios, crearRutina, cargando } = React.useContext(BucketContext);

  const [rutinaNueva, setRutinaNueva] = useState({
    Nombre: "",
    Ejercicios: [],
    Preparacion: [],
  });

  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [nuevoPaso, setNuevoPaso] = useState("");

  // Manejar la búsqueda de ejercicios
  const handleBuscarEjercicio = (e) => {
    const query = e.target.value.toLowerCase();
    setBusqueda(query);

    let resultados = ejercicios.filter((ejercicio) =>
      ejercicio.Nombre.toLowerCase().includes(query)
    );

    if (query === "") {
      resultados = [];
    }
    setResultadosBusqueda(resultados);
  };

  // Manejar la adición de ejercicios seleccionados
  const handleAgregarEjercicio = (id) => {
    setRutinaNueva({
      ...rutinaNueva,
      Ejercicios: [...rutinaNueva.Ejercicios, id],
    });
    setBusqueda("");
    setResultadosBusqueda([]);
  };

  // Manejar la adición de pasos de preparación
  const handleAgregarPaso = () => {
    if (
      nuevoPaso.trim() &&
      !rutinaNueva.Preparacion.includes(nuevoPaso.trim())
    ) {
      setRutinaNueva({
        ...rutinaNueva,
        Preparacion: [...rutinaNueva.Preparacion, nuevoPaso.trim()],
      });
      setNuevoPaso(""); // Limpiar el campo de texto después de agregar
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simular el registro de la rutina
    crearRutina(rutinaNueva);

    // Mostrar alerta con el nombre de la rutina
    alert(`Registrado con éxito: ${rutinaNueva.Nombre}`);

    // Limpiar los campos del formulario
    setRutinaNueva({
      Nombre: "",
      Ejercicios: [],
      Preparacion: [],
      Descripcion: "",
    });
    setBusqueda(""); // Limpiar la búsqueda
    setResultadosBusqueda([]); // Limpiar resultados de búsqueda
    setNuevoPaso(""); // Limpiar campo de nuevo paso
  };

  const handleEliminarEjercicio = (id) => {
    setRutinaNueva((prevRutina) => ({
      ...prevRutina,
      Ejercicios: prevRutina.Ejercicios.filter(
        (ejercicioId) => ejercicioId !== id
      ),
    }));
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Registrar Nueva Rutina
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre de la rutina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la rutina:
          </label>
          <input
            type="text"
            name="Nombre"
            value={rutinaNueva.Nombre}
            onChange={(e) =>
              setRutinaNueva({ ...rutinaNueva, Nombre: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción de la rutina:
          </label>
          <textarea
            type="text"
            name="Descripcion"
            value={rutinaNueva.Descripcion}
            onChange={(e) =>
              setRutinaNueva({ ...rutinaNueva, Descripcion: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Buscar y seleccionar ejercicios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar ejercicios:
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={handleBuscarEjercicio}
            placeholder="Escribe para buscar ejercicios"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {resultadosBusqueda.length > 0 && (
            <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {resultadosBusqueda.map((ejercicio) => (
                <li
                  key={ejercicio.id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => handleAgregarEjercicio(ejercicio.id)}
                    className="w-full text-left"
                  >
                    {ejercicio.Nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mostrar ejercicios seleccionados */}
        <div>
          <h3 className="block text-sm font-medium text-gray-700 mb-1">
            Ejercicios seleccionados:
          </h3>
          <ul className="mt-2 space-y-1">
            {rutinaNueva.Ejercicios.map((ejercicioId, index) => {
              const ejercicio = ejercicios.find((ej) => ej.id === ejercicioId);
              return (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg text-gray-700"
                >
                  {ejercicio ? ejercicio.Nombre : "Ejercicio no encontrado"}
                  <button
                    type="button"
                    onClick={() => handleEliminarEjercicio(ejercicioId)}
                    className="ml-2 px-2 py-1 text-xs bg-red-800 text-white rounded hover:bg-red-800 hover:text-gray-300"
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Agregar pasos de preparación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pasos para la preparación:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={nuevoPaso}
              onChange={(e) => setNuevoPaso(e.target.value)}
              placeholder="Escribe un paso"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAgregarPaso}
              className="text-sm bg-blue-600 hover:bg-blue-900 hover:text-blue-50"
            >
              Agregar Paso
            </button>
          </div>
        </div>

        {/* Mostrar pasos de preparación */}
        <div>
          <h3 className="block text-sm font-medium text-gray-700 mb-1">
            Pasos de preparación:
          </h3>
          <ul className="mt-2 space-y-1">
            {rutinaNueva.Preparacion.map((preparacion, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 flex flex-row justify-between items-center"
              >
                <span>{preparacion}</span>
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-red-800 text-white rounded hover:bg-red-800 hover:text-gray-300"
                  onClick={() => {
                    const nuevosPasos = rutinaNueva.Preparacion.filter(
                      (_, pasoIndex) => pasoIndex !== index
                    );
                    setRutinaNueva({
                      ...rutinaNueva,
                      Preparacion: nuevosPasos,
                    });
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón Enviar */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              cargando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-900 hover:text-blue-50"
            }`}
            disabled={cargando}
          >
            {cargando ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroRutinas;
