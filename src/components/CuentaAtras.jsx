import React, { useState, useEffect } from "react";

function CuentaAtras({ value }) {
  const [time, setTime] = useState(parseTime(value)); // Tiempo restante en segundos
  const [running, setRunning] = useState(false);

  // Convierte un string en formato mm:ss a segundos
  function parseTime(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  // Convierte segundos a formato mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  // Manejar el temporizador
  useEffect(() => {
    let timer;
    if (running && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setRunning(false);
      alert("¡Tiempo terminado!");
    }
    return () => clearInterval(timer);
  }, [running, time]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => setRunning(!running)}
        onContextMenu={(e) => {
          e.preventDefault();
          setTime(parseTime(value)); // Reinicia al valor inicial
          setRunning(false);
        }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        title={
          running
            ? "Haz clic para pausar o clic derecho para reiniciar"
            : "Haz clic para iniciar"
        }
      >
        {formatTime(time)}
      </button>
    </div>
  );
}

export default CuentaAtras;
