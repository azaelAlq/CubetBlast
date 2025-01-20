import React from "react";
import VideoPreview from "../../components/VideoPreview";
import { EjercicioContext } from "../../context/EntrenamientoContext";
import { useNavigate } from "react-router";
import CuentaAtras from "../../components/CuentaAtras";

function Entrenamiento() {
  const Navigate = useNavigate();

  const {
    eliminarEntrenamiento,
    anteriorEjercicio,
    siguienteEjercicio,
    datoCambia,
    cargandoImagen,
    setDatoCambia,
    ver,
  } = React.useContext(EjercicioContext);

  function calculateWeightOptions(totalWeight) {
    if (totalWeight > 200) {
      return <p>No puedes, te partirías como una ramita seca</p>;
    }

    if (!totalWeight || totalWeight % 2 !== 0) {
      return (
        <p>
          El peso total debe ser un número par para dividirlo en partes iguales.
        </p>
      );
    }

    const weights = [10, 8, 5, 2, 1]; // Discos disponibles
    const halfWeight = totalWeight / 2; // Peso que debe ir en cada lado

    const generateOption = (target) => {
      let remaining = target;
      const distribution = [];

      for (let weight of weights) {
        while (remaining >= weight) {
          distribution.push(weight);
          remaining -= weight;
        }
      }

      return distribution;
    };

    const option1 = generateOption(halfWeight);
    const option2 = generateOption(halfWeight - 1).concat(1); // Ajustar ligeramente el balance
    const option3 = generateOption(halfWeight - 2).concat(2); // Otra variación

    const options = [
      { option: "Opción 1", weights: option1 },
      { option: "Opción 2", weights: option2 },
      { option: "Opción 3", weights: option3 },
    ];

    const getColor = (weight) => {
      switch (weight) {
        case 10:
          return "text-red-500";
        case 8:
          return "text-blue-500";
        case 5:
          return "text-green-500";
        case 2:
          return "text-yellow-500";
        case 1:
          return "text-purple-500";
        default:
          return "text-black";
      }
    };

    return (
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Opción</th>
            <th className="border border-gray-400 px-4 py-2">Distribución</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">{opt.option}</td>
              <td className="border border-gray-400 px-4 py-2">
                {opt.weights.map((weight, i) => (
                  <span
                    key={i}
                    className={`${getColor(weight)} font-bold`}
                    style={{ marginRight: "0.5rem" }}
                  >
                    {weight}
                  </span>
                ))}
                × 2
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 px-8 py-3 flex justify-between items-center text-white">
        <div className="text">
          <h1 className="text-2xl font-bold">Bucket Blast</h1>
          <p className="text-sm lg:text-xl font-mono">made by azael</p>
        </div>
        <div className="text-center">
          <h1 className="text-xl lg:text-2xl font-bold">
            Rutina de {`espalda`}
          </h1>
          <p className="text-sm lg:text-xl font-mono">
            Ejercicios restantes 9/15
          </p>
        </div>
      </header>

      {/* Contenido principal con grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 p-6">
        {/* Columna izquierda (Previsualización y Tiempo) */}
        <div className="flex flex-col gap-6">
          {/* Sección de Tiempo */}
          <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <div className="text-center">
              <p className="text-3xl font-semibold text-gray-800">Cronómetro</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {tiempoCronometro}
              </p>
            </div>

            <div className="mt-1 text-center">
              <p className="font-semibold text-gray-700">Descanso:</p>
              <div className="flex gap-6 justify-center">
                <CuentaAtras value="5:00" />
                <CuentaAtras value="2:30" />
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                <span className="font-semibold">Clic</span> para iniciar |
                <span className="font-semibold"> Clic derecho</span> para
                reiniciar
              </p>
            </div>
          </div>

          {/* Sección de Previsualización */}
          <div className="flex-1 px-4 bg-gray-50 border border-gray-200 rounded-lg shadow-lg flex justify-center items-center">
            {cargandoImagen ? (
              <p>Cargando...</p>
            ) : (
              <VideoPreview url={datoCambia.imagen} />
            )}
          </div>

          {/* Botón Finalizar Entrenamiento */}
          <div className="flex justify-center mb-7">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600"
              onClick={eliminarEntrenamiento}
            >
              Finalizar entrenamiento
            </button>
          </div>
        </div>

        {/* Columna derecha (Información y Botones) */}
        <div className="flex flex-col gap-6">
          {/* Sección de Información */}
          <div className="p-4 bg-gray-900 border  rounded-lg shadow-lg">
            <h3 className="text-2xl lg:text-3xl font-semibold text-center mb-6 text-white">
              {datoCambia.nombreEjercicio}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col gap-2">
                <p className="text-lg">
                  <strong>Agarre: </strong>
                  {datoCambia.agarre}
                </p>
                <p className="text-lg">
                  <strong>Material: </strong>
                  {datoCambia.material}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong>Nota: </strong>
                  {datoCambia.nota}
                </p>
              </div>
            </div>

            {/* Rendimiento */}
            <div className="bg-white rounded-lg shadow mt-6 p-4">
              <div className="flex flex-wrap justify-around items-center gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-center font-semibold text-lg">
                    Peso en kilos
                  </p>
                  <input
                    type="number"
                    placeholder={"Meta: " + datoCambia.pesoAnterior}
                    className="text-center border border-gray-300 rounded-lg px-2 py-1 focus:ring focus:ring-blue-200"
                    value={datoCambia.pesoActual} // Vincula el input con el valor del estado
                    onChange={(e) =>
                      setDatoCambia((prev) => ({
                        ...prev,
                        pesoActual:
                          e.target.value !== "" ? Number(e.target.value) : "", // Permite vaciar el campo si el input está vacío
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-center font-semibold text-lg">
                    Repeticiones
                  </p>
                  <input
                    type="number"
                    className="text-center border border-gray-300 rounded-lg px-2 py-1 focus:ring focus:ring-blue-200"
                    placeholder={"Meta: " + datoCambia.repeticionesAnteriores}
                    value={datoCambia.repeticionesActual} // Vincula el input con el valor de repeticionesActual en el estado
                    onChange={(e) =>
                      setDatoCambia((prev) => ({
                        ...prev,
                        repeticionesActual:
                          e.target.value !== "" ? Number(e.target.value) : "", // Permite vaciar el campo si el input está vacío
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                {calculateWeightOptions(
                  datoCambia.pesoActual == ""
                    ? datoCambia.pesoAnterior
                    : datoCambia.pesoActual
                )}
              </div>
            </div>
          </div>

          {/* Sección de Botones */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-4">
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
                onClick={anteriorEjercicio}
              >
                Ejercicio anterior
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
                onClick={siguienteEjercicio}
              >
                Siguiente ejercicio
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
                onClick={ver}
              >
                ver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entrenamiento;
