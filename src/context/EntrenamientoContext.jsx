import { useState } from "react";
import { createContext } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router";

export const EjercicioContext = createContext();

export const EjercicioProvider = ({ children }) => {
  const navigate = useNavigate();
  const [terminarEntreno, setTerminarEntreno] = useState(false);
  const [ultimoEntrenamiento, SetultimoEntrenamiento] = useState({});
  const [bolUltimoEntreno, setBolUltimoEntreno] = useState(false);
  const [entrenamientoActual, setEntrenamientoActual] = useState({});
  const [rutina, setRutina] = useState({});
  const [cargando, setCargando] = useState(false);
  const [numEjercicio, setNumEjercicio] = useState(0);

  const [datoCambia, setdatoCambia] = useState({
    nombreEjercicio: "",
    preparacion: "",
    pesoActual: 0,
    pesoAnterior: 0,
    repeticionesActual: 0,
    repeticionesAnteriores: 0,
    agarre: "",
    material: "",
    nota: "",
    imagen: "",
  });

  const [ejercicios, setEjercicios] = useState([]);

  const getEjercicios = async () => {
    try {
      const { data, error } = await supabase
        .from("Nombre_Ejercicios")
        .select("*");
      if (error) {
        alert("Error en obtener ejercicios en ls BD: " + error);
      }
      setEjercicios(data);
    } catch (error) {
      alert("Error en el codigo para obtener ejercicios: " + error);
    } finally {
    }
  };

  const crearEntrenamiento = async (idRutina) => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("Entrenamientos")
        .insert([
          {
            IdRutina: idRutina,
            Rendimiento: Array(rutina.Ejercicios.length).fill(0),
          },
        ])
        .select();

      if (error) {
        throw new Error(`Error creando entrenamiento: ${error.message}`);
      }

      setEntrenamientoActual(data[0]);

      // Llama a la función para manejar los datos de los ejercicios
      procesarEjerciciosRutina();

      setNumEjercicio(1);

      if (bolUltimoEntreno) {
        //logica para poner el peso del ultimo entrenamiento
      }
    } catch (err) {
      console.error("Hubo un error creando el entrenamiento:", err.message);
      alert(`No se pudo crear el entrenamiento: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };
  const procesarEjerciciosRutina = () => {
    for (let i = 0; i < rutina.Ejercicios.length; i++) {
      for (let j = 0; j < ejercicios.length; j++) {
        if (rutina.Ejercicios[i] === ejercicios[j].id) {
          setdatoCambia((prevState) => ({
            ...prevState, // Propiedades existentes
            nombreEjercicio: ejercicios[j].Nombre,
            agarre: ejercicios[j].TipAgarre,
            material: ejercicios[j].Material || "N/A",
            nota: ejercicios[j].NotaRealizacion || "Sin nota",
            imagen: ejercicios[j].URLvideo || "Sin imagen",
          }));
          return;
        }
      }
    }
  };

  const eliminarEntrenamiento = async () => {
    // Confirmación inicial con ID en la alerta
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar el entrenamiento con ID: ${entrenamientoActual.id}?`
    );

    if (!confirmacion) {
      console.log("Eliminación cancelada por el usuario.");
      return; // Si el usuario cancela, salimos de la función
    }

    // Intentar eliminar el entrenamiento
    const { data, error } = await supabase
      .from("Entrenamientos")
      .delete()
      .eq("id", entrenamientoActual.id);

    if (error) {
      alert(
        "Ocurrió un error al eliminar el entrenamiento. Intenta nuevamente."
      );
    } else {
      alert(
        `Entrenamiento con ID: ${entrenamientoActual.id} eliminado exitosamente.`
      );
      navigate("/IniciarEntrenamiento");
    }
  };

  const siguienteEjercicio = () => {
    //esto tiene que ir al final
    setTerminarEntreno(false);
    if (rutina.ejercicios.length === entrenamientoActual.rendimiento.length) {
      setTerminarEntreno(true);
    }
  };
  const anteriorEjercicio = () => {
    // Lógica para pasar al anterior Ejercicio
  };

  return (
    <EjercicioContext.Provider
      value={{
        setBolUltimoEntreno,
        SetultimoEntrenamiento,
        setEntrenamientoActual,
        crearEntrenamiento,
        setRutina,
        eliminarEntrenamiento,
        getEjercicios,
        setTerminarEntreno,
        siguienteEjercicio,
        anteriorEjercicio,
        setdatoCambia,
        datoCambia,
        setNumEjercicio,
      }}
    >
      {children}
    </EjercicioContext.Provider>
  );
};
