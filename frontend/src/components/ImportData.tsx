import React, { useEffect } from "react";
import { RoomData } from "../models/Room";
import { useQuery } from "@tanstack/react-query";
import Api from "../Api";

function ImportData() {
  let token = window.sessionStorage.getItem("jwtToken");
  const getImportRooms = () => {
    return Api.get("import/room", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  };

  const handleClick = () => {
    refetch();
  };

  const { isFetching, data, refetch } = useQuery<RoomData[]>(
    ["data"],
    getImportRooms,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  useEffect(() => {
    token = window.sessionStorage.getItem("jwtToken");
    console.log(token);
  }, [token]);

  return (
    <div className="flex flex-col items-center pt-20 pb-6">
      <div className="w-2/5 pb-14 text-center text-2xl font-medium">
        <p>Import danych</p>
      </div>
      <button
        className="mb-14 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg
        bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"
        onClick={handleClick}
      >
        Importuj dane
      </button>
      {isFetching ? (
        <p>Ładowanie danych</p>
      ) : (
        <div>
          {data && (
            <div className="w-[450px] px-6">
              <p className="font-medium">Numer sali</p>
              <hr className="h-px my-3 bg-gray-200 border-0 h-0.5 dark:bg-gray-700" />
            </div>
          )}
          <ul role="list" className="w-[450px] p-6 divide-y divide-slate-200">
            {data?.map((room) => (
              <li className="first:pt-0 last:pb-0 py-8" key={room.id}>
                <div className="flex text-center items-center">
                  <p className="basis-3/5 font-medium">{room.number}</p>
                  <button
                    className="basis-2/5  px-8 py-2  transition hover:scale-110 delay-150 rounded-lg
        bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"
                  >
                    Importuj plan
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImportData;
