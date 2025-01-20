import React, { useState, useEffect } from "react";

function Cronometro() {
  const [time, setTime] = useState(0); // Tiempo transcurrido en segundos
  const [running, setRunning] = useState(false); // Estado del cronómetro

  // Actualizar el tiempo transcurrido cada segundo
  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [running]);

  // Formatear el tiempo en formato mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <button
      onClick={() => setRunning(!running)}
      onContextMenu={(e) => {
        e.preventDefault(); // Evita el menú contextual por defecto
        setTime(0);
        setRunning(false);
      }}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        position: "relative",
      }}
      title={
        running
          ? "Haz clic para pausar o clic derecho para reiniciar"
          : "Haz clic para iniciar"
      }
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {formatTime(time)}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          color: "gray",
        }}
      >
        {running ? "Cancelar - Reiniciar" : "Iniciar"}
      </span>
    </button>
  );
}

export default Cronometro;
