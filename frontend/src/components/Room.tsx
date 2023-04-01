import React from "react";
import { useParams } from "react-router";

function Room() {
  const { id } = useParams();

  return <h1 className="p-6">Room {id}</h1>;
}

export default Room;
