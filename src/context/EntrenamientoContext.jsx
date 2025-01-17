import { useState, useEffect } from "react";
import { createContext } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router";

export const EjercicioContext = createContext();

export const EjercicioProvider = ({ children }) => {
  const navigate = useNavigate();

  //-------------------------------------------------------------------

  // Estado global para el tiempo transcurrido del cronómetro
  const [tiempoCronometro, setTiempoCronometro] = useState(0);
  const [isCorriendo, setIsCorriendo] = useState(false); // Controla si el cronómetro está en ejecución

  // Función para formatear el tiempo en formato mm:ss
  const formatearTiempo = (tiempo) => {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
      2,
      "0"
    )}`;
  };

  // Función que inicia el cronómetro
  const iniciarCronometro = () => {
    setTiempoCronometro(0); // Reiniciar el tiempo
    setIsCorriendo(true); // Iniciar el cronómetro
  };

  // Efecto para actualizar el tiempo cada segundo si el cronómetro está corriendo
  useEffect(() => {
    let intervalo;
    if (isCorriendo) {
      intervalo = setInterval(() => {
        setTiempoCronometro((prev) => prev + 1); // Incrementa el tiempo por cada segundo
      }, 1000);
    } else if (!isCorriendo && tiempoCronometro !== 0) {
      clearInterval(intervalo); // Detiene el intervalo cuando el cronómetro se detiene
    }
    return () => clearInterval(intervalo); // Limpiar el intervalo cuando se desmonte el componente
  }, [isCorriendo]);
  //-------------------------------------------------------------------
  //datos para cargar o mejorar la experiencia ------------------------
  // Estado para gestionar la carga de imágenes
  const [cargandoImagen, setCargandoImagen] = useState(false);

  //cosa que no se debe tocar para el funcionamiento del programa principal
  // Estado para almacenar la lista de ejercicios desde la base de datos
  const [ejercicios, setEjercicios] = useState([]);

  // Estado para almacenar la rutina actual
  const [rutina, setRutina] = useState({});

  //-------------------------------------------------------------------
  //este es la data de del entrenamiento, con este tenemos que obtener el id para guardar todo

  // Estado para gestionar el índice del ejercicio actual
  const [numEjercicio, setNumEjercicio] = useState(0);

  // Estado para los datos del entrenamiento actual - id para guardar los datos al final
  const [entrenamientoActual, setEntrenamientoActual] = useState({});

  // Estado para almacenar datos del último entrenamiento, obtenemos la nota y si es que hay un ultimo entrenamiento se guardan los datos
  const [ultimoEntrenamiento, SetultimoEntrenamiento] = useState({});

  //objeto para el rendimiento anterior, si es que no hay entrenamiento entonces es un array de objetos vacios
  const [rendimientoAnterior, setRendimientoAnterior] = useState([]);

  //rendimiento a subir a la base de datos
  const [rendimientoSubir, setRendimientoSubir] = useState([]);

  //-------------------------------------------------------------------
  //para poner los datos en el formulario

  // Estado para almacenar datos del ejercicio actual en curso
  const [datoCambia, setDatoCambia] = useState({
    pesoActual: "", //peso del formulario
    pesoAnterior: 0, //peso del entrenamiento anterior
    repeticionesActual: "", //repeticiones del formulario
    repeticionesAnteriores: 0, //repeticiones del entrenamiento anterior
    preparacion: "", //deberia de ser la nota de la rutina a la hora de empezar pero todavia no se usa //CAMBIAR
    nombreEjercicio: "", // Nombre del ejercicio en parte de arriba
    agarre: "", //agarre del ejercicio ------
    material: "", //material del ejercicio ------
    nota: "", //nota del ejercicio ------
    imagen: "", //imagen del ejercicio ------
  });

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

  //esto es para cuando el usuario quiera salir del entrenmiento y borre el entrenamiento que se hizo
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

  // Función para crear un nuevo entrenamiento bd antes de iniciar el entrenamiento
  const crearEntrenamiento = async (idRutina) => {
    try {
      const { data, error } = await supabase
        .from("Entrenamientos")
        .insert([
          {
            IdRutina: idRutina,
          },
        ])
        .select();

      if (error) {
        throw new Error(`Error creando entrenamiento: ${error.message}`);
      }

      setEntrenamientoActual(data[0]);

      // Llama a la función para manejar los datos de los ejercicios
      procesarEjerciciosRutina();
    } catch (err) {
      console.error("Hubo un error creando el entrenamiento:", err.message);
      alert(`No se pudo crear el entrenamiento: ${err.message}`);
    }
  };

  //esta funcion sirve para buscar que ejercicio se esta haciendo y mostrar los datos de este
  const procesarEjerciciosRutina = () => {
    for (let i = 0; i < rutina.Ejercicios.length; i++) {
      for (let j = 0; j < ejercicios.length; j++) {
        if (rutina.Ejercicios[i] === ejercicios[j].id) {
          setDatoCambia((prevState) => ({
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

  const finalizarEntrenamiento = async () => {
    if (
      confirm(
        "Has completado todos los ejercicios de la rutina. ¿Quieres finalizar?"
      )
    ) {
      try {
        setIsCorriendo(false);
        navigate("/EntrenamientoFinalizado");
      } catch (error) {
        console.error("Error al finalizar el entrenamiento:", error);
        alert(
          "Ocurrió un error al finalizar el entrenamiento. Por favor, intenta nuevamente."
        );
      }
    } else {
      alert("Has cancelado la acción.");
    }
  };

  const valorRendimientoActual = async (
    entrenamientoBol,
    todosLosEjercicios = []
  ) => {
    // Inicializamos rendimientoSubir
    let rendimientoSubir = rutina.Ejercicios.map((ejercicio) => ({
      idEjercicio: ejercicio, // Suponiendo que cada ejercicio tiene un id
      peso: 0, // Inicializamos en 0
      reps: 0, // Inicializamos en 0
      modificado: false, // Bandera para saber si se modificó el valor
    }));

    let rendimientoAnterior = [];

    if (!entrenamientoBol) {
      // Si no hay entrenamiento activo
      rendimientoAnterior = rutina.Ejercicios.map(() => ({
        peso: 0, // Valor predeterminado
        reps: 0, // Valor predeterminado
      }));
    } else {
      try {
        // Realizamos las consultas a la base de datos
        const resultados = await Promise.all(
          todosLosEjercicios.map(async (ejercicioID) => {
            const { data, error } = await supabase
              .from("Ejercicios")
              .select("*")
              .eq("id", ejercicioID);

            if (error) {
              console.error("Error al obtener datos de la BD:", error);
              alert("Error en la BD: " + error.message);
              return null; // Si hay error, devolvemos null
            }

            return data[0]; // Devolvemos el primer resultado
          })
        );

        // Filtramos los resultados no válidos (null)
        const datosValidos = resultados.filter((dato) => dato !== null);

        // Actualizamos rendimientoSubir dinámicamente
        datosValidos.forEach((ejercicioData) => {
          const index = rendimientoSubir.findIndex(
            (item) => item.idEjercicio === ejercicioData.id
          );

          if (index !== -1) {
            rendimientoSubir[index].peso = ejercicioData.Peso || 0;
            rendimientoSubir[index].reps = ejercicioData.Reps || 0;
            rendimientoSubir[index].modificado = true;
          }
        });

        // Si necesitas rendimientoAnterior basado en datos obtenidos:
        rendimientoAnterior = datosValidos.map((ejercicioData) => ({
          peso: ejercicioData.Peso || 0,
          reps: ejercicioData.Reps || 0,
        }));
      } catch (error) {
        console.log("Error en la búsqueda de los ejercicios: ", error);
      }
    }

    // Establecemos los nuevos valores
    setRendimientoSubir(rendimientoSubir);
    setRendimientoAnterior(rendimientoAnterior);
  };

  const siguienteEjercicio = () => {
    if (numEjercicio < rutina.Ejercicios.length - 1) {
      const nuevoNumEjercicio = numEjercicio + 1;

      // Guardar datos del ejercicio actual
      const rendimientoActualizado = rendimientoSubir.map((item, index) => {
        if (index === numEjercicio) {
          return {
            ...item,
            peso:
              datoCambia.pesoActual !== ""
                ? Number(datoCambia.pesoActual)
                : item.modificado
                ? item.peso
                : datoCambia.pesoAnterior,
            reps:
              datoCambia.repeticionesActual !== ""
                ? Number(datoCambia.repeticionesActual)
                : item.modificado
                ? item.reps
                : datoCambia.repeticionesAnteriores,
            modificado:
              datoCambia.pesoActual !== "" ||
              datoCambia.repeticionesActual !== "",
          };
        }
        return item;
      });

      setRendimientoSubir(rendimientoActualizado);

      // Configurar datos del siguiente ejercicio
      const idEjercicio = rutina.Ejercicios[nuevoNumEjercicio];
      const ejercicio = ejercicios.find((e) => e.id === idEjercicio);
      const rendimientoSiguiente = rendimientoSubir[nuevoNumEjercicio];
      setDatoCambia({
        ...datoCambia,
        nombreEjercicio: ejercicio?.Nombre || "",
        agarre: ejercicio?.TipAgarre || "",
        material: ejercicio?.Material || "",
        nota: ejercicio?.NotaRealizacion || "",
        imagen: ejercicio?.URLvideo || "",
        pesoActual: rendimientoSiguiente?.modificado
          ? rendimientoSiguiente.peso
          : "",
        pesoAnterior: rendimientoAnterior[nuevoNumEjercicio]?.peso || 0,
        repeticionesActual: rendimientoSiguiente?.modificado
          ? rendimientoSiguiente.reps
          : "",
        repeticionesAnteriores:
          rendimientoAnterior[nuevoNumEjercicio]?.reps || 0,
      });
      setNumEjercicio(nuevoNumEjercicio);
    } else {
      // Guardar datos del último ejercicio antes de finalizar
      const rendimientoActualizado = rendimientoSubir.map((item, index) => {
        if (index === numEjercicio) {
          return {
            ...item,
            peso:
              datoCambia.pesoActual !== ""
                ? Number(datoCambia.pesoActual)
                : item.modificado
                ? item.peso
                : datoCambia.pesoAnterior,
            reps:
              datoCambia.repeticionesActual !== ""
                ? Number(datoCambia.repeticionesActual)
                : item.modificado
                ? item.reps
                : datoCambia.repeticionesAnteriores,
            modificado:
              datoCambia.pesoActual !== "" ||
              datoCambia.repeticionesActual !== "",
          };
        }
        return item;
      });

      setRendimientoSubir(rendimientoActualizado);
      finalizarEntrenamiento();
    }
  };

  const anteriorEjercicio = () => {
    if (numEjercicio > 0) {
      const nuevoNumEjercicio = numEjercicio - 1;

      // Guardar datos del ejercicio actual
      const rendimientoActualizado = rendimientoSubir.map((item, index) => {
        if (index === numEjercicio) {
          return {
            ...item,
            peso:
              datoCambia.pesoActual !== ""
                ? Number(datoCambia.pesoActual)
                : item.modificado
                ? item.peso
                : datoCambia.pesoAnterior,
            reps:
              datoCambia.repeticionesActual !== ""
                ? Number(datoCambia.repeticionesActual)
                : item.modificado
                ? item.reps
                : datoCambia.repeticionesAnteriores,
            modificado:
              datoCambia.pesoActual !== "" ||
              datoCambia.repeticionesActual !== "",
          };
        }
        return item;
      });

      setRendimientoSubir(rendimientoActualizado);

      // Configurar datos del ejercicio anterior
      const idEjercicio = rutina.Ejercicios[nuevoNumEjercicio];
      const ejercicio = ejercicios.find((e) => e.id === idEjercicio);
      const rendimientoAnteriorEjercicio = rendimientoSubir[nuevoNumEjercicio];

      setDatoCambia({
        ...datoCambia,
        nombreEjercicio: ejercicio?.Nombre || "",
        agarre: ejercicio?.TipAgarre || "",
        material: ejercicio?.Material || "",
        nota: ejercicio?.NotaRealizacion || "",
        imagen: ejercicio?.URLvideo || "",
        pesoActual: rendimientoAnteriorEjercicio?.modificado
          ? rendimientoAnteriorEjercicio.peso
          : "",
        pesoAnterior: rendimientoAnterior[nuevoNumEjercicio]?.peso || 0,
        repeticionesActual: rendimientoAnteriorEjercicio?.modificado
          ? rendimientoAnteriorEjercicio.reps
          : "",
        repeticionesAnteriores:
          rendimientoAnterior[nuevoNumEjercicio]?.reps || 0,
      });
      setNumEjercicio(nuevoNumEjercicio);
    } else {
      alert("Estás en el primer ejercicio, no puedes retroceder más.");
    }
  };

  return (
    <EjercicioContext.Provider
      value={{
        SetultimoEntrenamiento,
        setEntrenamientoActual,
        crearEntrenamiento,
        setRutina,
        eliminarEntrenamiento,
        getEjercicios,
        siguienteEjercicio,
        anteriorEjercicio,
        setDatoCambia,
        datoCambia,
        cargandoImagen,
        setRendimientoSubir,
        setRendimientoAnterior,
        valorRendimientoActual,
        setNumEjercicio,
        tiempoCronometro,
        iniciarCronometro,
        formatearTiempo,
        numEjercicio,
        ejercicios,
        rutina,
        tiempoCronometro,
        rendimientoSubir,
        formatearTiempo,
        rendimientoAnterior,
        setIsCorriendo,
        ultimoEntrenamiento,
      }}
    >
      {children}
    </EjercicioContext.Provider>
  );
};
