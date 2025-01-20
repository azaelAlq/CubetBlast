import React from "react";
import { EjercicioContext } from "../../context/EntrenamientoContext";
import { useNavigate } from "react-router";

function EntrenamientoFinalizado() {
  const Navigate = useNavigate();

  const {} = React.useContext(EjercicioContext);
  return <div>EntrenamientoFinalizado</div>;
}

export default EntrenamientoFinalizado;
