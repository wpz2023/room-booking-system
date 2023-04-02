import React from 'react'
import { RoomData } from "../models/Room";
import { useQuery } from "@tanstack/react-query";
import Api from "../Api";
import {Link} from "react-router-dom";


function ImportData() {

  const emulateFetch = () => {
    return Api.get("import/room").then((res) => res.data);
  }

  const handleClick = () => {
      refetch();
      data?.forEach((room) => (room.type = "Sala dydatkyczna"));

  };

  const { isLoading, isFetching, data, refetch} = useQuery<RoomData[]>( ["data"], emulateFetch, {
    refetchOnWindowFocus: false,
    enabled: false
  });

  return (
      <div className="flex flex-col items-center pt-20 pb-6">
        <div className="w-2/5 pb-14 text-center text-2xl font-medium">
          <p>Import danych</p>
        </div>
        <button className="mb-14 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg
        bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500" onClick={handleClick}>
          Zaimportuj dane
        </button>
        {!isLoading && isFetching ? <p>Ładowanie danych</p> : (
        <ul role="list" className="w-full p-6 divide-y divide-slate-200">
          {data?.map((room) => (
              <li className="first:pt-0 last:pb-0" key={room.id}>
                <div className="flex justify-evenly">
                  <Link to={"/sale/" + room.id.toString()}>{room.number}</Link>
                  <div className="">{room.type == "didactics_room" ? "Sala dydatktyczna" : room.type}</div>
                  <div className="">{room.capacity}</div>
                  <button className="mb-14 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg
        bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">Importuj</button>
                </div>
              </li>
          ))}
        </ul>
        )}
      </div>
  );
}


export default ImportData