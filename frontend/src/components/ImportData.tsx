import React, {useEffect, useState} from "react";
import {RoomData} from "../models/Room";
import {useMutation, useQuery} from "@tanstack/react-query";
import Api from "../Api";
import ConflictPopUp from "./ConflictPopUp";
import {Activity} from "../models/Activity";
import {Conflict} from "../models/Conflict";




function ImportData() {
  const token = window.sessionStorage.getItem("jwtToken");

  const getImportRooms = () => {
    return Api.authApi
      .get("import/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
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




  const [activitiesToDelete, setActivitiesToDelete] = useState([])


  const {
      mutate,
      data: roomConflict,
      isLoading: loadingConflicts,
      error } = useMutation<Conflict>( async (id) => {
          const response =  await Api.authApi.post(`activity/room/${id}/conflicts`, activitiesToDelete, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
          return response.data
      },
      {
          onSuccess: (responseData) => {
              if (responseData){
                  console.log("MAM")
                  console.log(responseData.userActivity)
                  setPopupVisible(true)
              }
          }
      });


  const [roomId, setRoomId] = useState(0);
  const [roomName, setRoomName] = useState("");

  const getRoomActivities = async () => {
      if (roomId != 0){
          return await Api.authApi
              .get(`import/activity/${roomId}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              })
              .then((res) => res.data)
              .finally(async() => await mutate(roomId));
      }
      return null
  }

  const {
      isFetching: isActivitiesFetching,
      refetch: refetchRoomActivities
  } = useQuery(["roomActivities"], getRoomActivities, {
      refetchOnWindowFocus: false,
      enabled: false,
  });


  const onButtonClick = (e) => {
      setRoomId(e.target.value)

  }


  useEffect( () => {
      refetchRoomActivities()
  }, [roomId])


  const [popupVisible, setPopupVisible] = useState(false)


  return (
    <div className="flex flex-col items-center pt-20 pb-6" >
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
            <div className="w-[650px] px-6">
              <p className="font-medium">Numer sali</p>
              <hr className="h-px my-3 bg-gray-200 border-0 h-0.5 dark:bg-gray-700" />
            </div>
          )}
          <ul role="list" className="w-full p-6 divide-y divide-slate-200">
            {data?.map((room) => (
              <li className="first:pt-0 last:pb-0 py-8" key={room.id}>
                <div className="flex text-center items-center">
                  <p className="basis-3/5 font-medium">{room.number}</p>
                  <div>
                      <button value={room.id} onClick={onButtonClick} disabled={isActivitiesFetching}
                              style={{cursor: isActivitiesFetching ? 'wait' : 'pointer'}}
                              className="basis-2/5  px-8 py-2  transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
                          Importuj plan
                      </button>
                      {isActivitiesFetching && roomId==room.id && (
                          <p className="pt-2 font-normal">Importowanie planu</p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
            {popupVisible &&
                <ConflictPopUp conflict={roomConflict} roomName={roomName} />}
        </div>
      )}
    </div>
  );
}

export default ImportData;
