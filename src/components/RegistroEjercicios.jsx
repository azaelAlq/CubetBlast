import React, { useState } from "react";
import VideoPreview from "./VideoPreview";
import { BucketContext } from "../context/BucketContext";

const RegistroEjercicios = () => {
  const { crearEjercicio, cargando } = React.useContext(BucketContext);

  const [formData, setFormData] = useState({
    nombre: "",
    tipoAgarre: "",
    material: "",
    urlVideo: "",
    notaRealizacion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, tipoAgarre, material, urlVideo, notaRealizacion } =
      formData;

    if (!nombre || !tipoAgarre || !material || !urlVideo || !notaRealizacion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      crearEjercicio(formData);

      alert(`Ejercicio registrado con éxito: ${formData.nombre}`);

      setFormData({
        nombre: "",
        tipoAgarre: "",
        material: "",
        urlVideo: "",
        notaRealizacion: "",
      });
    } catch (error) {
      alert("Hubo un error al registrar el ejercicio: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Registrar Nuevo Ejercicio
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre:
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Campo Tipo de Agarre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Agarre:
          </label>
          <select
            name="tipoAgarre"
            value={formData.tipoAgarre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecciona un tipo de agarre
            </option>
            <option value="Normal">Normal</option>
            <option value="Plano Supino">Plano Supino</option>
            <option value="Plano Prono">Plano Prono</option>
            <option value="Triangular">Triangular</option>
            <option value="Unilateral">Unilateral</option>
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
            <option value="Cuerdas">Cuerdas</option>
            <option value="Supino">Supino</option>
            <option value="Prono">Prono</option>
          </select>
        </div>

        {/* Campo Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material:
          </label>
          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecciona un material
            </option>
            <option value="Polea">Polea</option>
            <option value="Barra Larga">Barra Larga</option>
            <option value="Barra Corta">Barra Corta</option>
            <option value="Barra Z">Barra Z</option>
            <option value="Barra Remo">Barra Remo</option>
            <option value="Mancuernas">Mancuernas</option>
            <option value="Anillas">Anillas</option>
            <option value="Barra de dominadas">Barra de dominadas</option>
            <option value="Paralelas chicas">Paralelas chicas</option>
            <option value="Discos solos">Discos solos</option>
          </select>
        </div>

        {/* Campo URL del Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL del Video:
          </label>
          <input
            type="url"
            name="urlVideo"
            value={formData.urlVideo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Previsualización del video */}
        {formData.urlVideo && <VideoPreview url={formData.urlVideo} />}

        {/* Campo Nota de Realización */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nota de Realización:
          </label>
          <textarea
            name="notaRealizacion"
            value={formData.notaRealizacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botón Registrar */}
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
};

export default RegistroEjercicios;
