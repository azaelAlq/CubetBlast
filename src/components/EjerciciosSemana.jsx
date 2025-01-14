import React from "react";

function EjerciciosSemana() {
  const dias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="py-2">
      <h3 className="text-3xl font-bold text-center mb-6">
        Entrenamiento semanal
      </h3>
      <div className="flex overflow-x-auto space-x-4">
        {dias.map((day) => (
          <div
            key={day}
            className="flex flex-col border border-black p-4 rounded-sm bg-white"
          >
            <h2 className="text-xl font-semibold text-center mb-2">{day}</h2>
            <textarea
              className="border border-black rounded p-2 w-full h-24 "
              placeholder="La rutina que hiciste"
            ></textarea>
            <input
              type="text"
              className="border border-black rounded p-2 w-full mt-2"
              placeholder="Puntuación(0-10)"
              min="0"
              max="10"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EjerciciosSemana;
