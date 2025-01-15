import { createContext } from "react";
import { supabase } from "../supabase/client";
import { useState } from "react";

export const BucketContext = createContext();

export const BucketProvider = ({ children }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const getEjercicios = async () => {
    try {
      setCargando(true);
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
      setCargando(false);
    }
  };

  const getRutinas = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from("Rutinas").select("*");

      if (error) {
        alert("Error en obtener rutinas en ls BD: " + error);
      }
      setRutinas(data);
    } catch (error) {
      alert("Error en el codigo para obtener rutinas: " + error);
    } finally {
      setCargando(false);
    }
  };

  const crearEjercicio = async (datos) => {
    try {
      setCargando(true);
      const { error, data } = await supabase
        .from("Nombre_Ejercicios")
        .insert({
          Nombre: datos.nombre,
          TipAgarre: datos.tipoAgarre,
          Material: datos.material,
          URLvideo: datos.urlVideo,
          NotaRealizacion: datos.notaRealizacion,
        })
        .select();

      setEjercicios([...ejercicios, data[0]]);

      if (error) {
        alert("Error en crear ejercicio en la BD: " + error);
      }
    } catch (error) {
      alert("Error en el codigo para crear ejercicio: " + error);
    } finally {
      setCargando(false);
    }
  };

  const crearRutina = async (datos) => {
    try {
      setCargando(true);
      const { error, data } = await supabase
        .from("Rutinas")
        .insert({
          Nombre: datos.Nombre,
          Ejercicios: datos.Ejercicios,
          Preparacion: datos.Preparacion,
          Descripcion: datos.Descripcion,
        })
        .select();

      setRutinas([...rutinas, data[0]]);

      if (error) {
        alert("Error en crear rutina en la BD: " + error);
      }
    } catch (error) {
      alert("Error en el codigo para crear rutina: " + error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <BucketContext.Provider
      value={{
        ejercicios,
        getEjercicios,
        cargando,
        getRutinas,
        rutinas,
        crearEjercicio,
        crearRutina,
      }}
    >
      {children}
    </BucketContext.Provider>
  );
};
