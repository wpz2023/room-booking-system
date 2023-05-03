import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function Reservation() {
  const { id } = useParams();
  let token = window.sessionStorage.getItem("jwtToken");

  useEffect(() => {
    token = window.sessionStorage.getItem("jwtToken");
  }, [token]);
  return <div className="p-6">Reservation {id}</div>;
}

export default Reservation;
