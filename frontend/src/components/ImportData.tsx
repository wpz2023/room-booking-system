import React, { useEffect, useState } from "react";
import { RoomData } from "../models/Room";
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../Api";
import ConflictPopUp from "./ConflictPopUp";
import { Conflict } from "../models/Conflict";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ImportData() {
  const token = window.sessionStorage.getItem("jwtToken");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [activitiesToDelete, setActivitiesToDelete] = useState<string[]>([]);
  const [roomIndex, setRoomIndex] = useState<number>(-1);
  const [allRoomsLoop, setAllRoomsLoop] = useState(false);
  const [clickedRoom, setRoom] = useState<RoomData>({
    capacity: 0,
    roomAnnotation: undefined,
    type: "",
    id: 0,
    number: 0,
  });

  useEffect(() => {
    console.log("Room id: " + roomIndex)
    if (roomIndex >= 0 && roomIndex < data.length){
      setRoom({
        ...clickedRoom,
        id: data[roomIndex].id,
        number: data[roomIndex].number,
      });
    } else {
      setRoomIndex(-1)
      setAllRoomsLoop(false)
    }
  }, [roomIndex])

  useEffect(() => {
    if (activitiesToDelete.length > 0) {
      mutate(clickedRoom.id);
    } else {
      console.log("wchodze")
      if (roomIndex >= 0){
        console.log("jestem")
        setRoomIndex(roomIndex + 1)
      }
    }
  }, [activitiesToDelete]);

  const { mutate, data: roomConflict } = useMutation<Conflict>(
    async (id) => {
      console.log("mutate - " + roomIndex)
      const response = await Api.authApi.post(
        `activity/room/${id}/conflicts`,
        activitiesToDelete,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivitiesToDelete([]);
      return response.data;
    },
    {
      onSuccess: (responseData) => {
        if (responseData) {
          console.log("popup - " + roomIndex)
          setPopupVisible(true);
        } else {
          console.log("DONE - " + clickedRoom.id)
          toast.success("Udało się zaimportować plan sali");
        }
      },
    }
  );

  const getRoomActivities = async () => {
    console.log("getRoomActivities - " + roomIndex)
    if (clickedRoom.id != 0) {
      return await Api.authApi
        .get(`import/activity/${clickedRoom.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .finally(async () => await mutate(clickedRoom.id));
    }
    return null;
  };

  const {
    isFetching: isActivitiesFetching,
    refetch: refetchRoomActivities,
  } = useQuery(["roomActivities"], getRoomActivities, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    refetchRoomActivities();
  }, [clickedRoom]);

  const getImportRooms = () => {
    return Api.authApi
      .get("import/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
  };

  const { isFetching, data, refetch } = useQuery<RoomData[]>(
    ["data"],
    getImportRooms,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleClick = () => {
    refetch();
  };

  const onButtonClick = (e) => {
    e.preventDefault();
    setRoom({
      ...clickedRoom,
      id: e.currentTarget.dataset.value1,
      number: e.currentTarget.dataset.value2,
    });
  };

  const deleteActivities = (activities: string[]) => {
    setActivitiesToDelete(activities);
  };

  const importAllRoomsActivities = (e) => {
    e.preventDefault();
    setAllRoomsLoop(true)
    setRoomIndex(0)
  }

  return (
    <div className="flex flex-col items-center pt-20 pb-6">
      <ToastContainer />
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
              <div className="flex flex-row items-end">
                <p className="basis-3/5 font-medium">Numer sali</p>
                <div className="flex flex-col">
                  <button
                      onClick={importAllRoomsActivities}
                      disabled={isActivitiesFetching}
                      style={{
                        cursor: isActivitiesFetching ? "wait" : "pointer",
                      }}
                      className="basis-2/5  px-4 py-2  transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
                    Importuj plany wszystkich sal
                  </button>
                  {isActivitiesFetching && allRoomsLoop && (
                      <p className="pt-2 font-normal text-center">Importowanie planu</p>
                  )}
                </div>
              </div>
              <hr className="h-px my-3 bg-gray-200 border-0 h-0.5 dark:bg-gray-700" />
            </div>
          )}
          <ul role="list" className="w-full p-6 divide-y divide-slate-200">
            {data?.map((room) => (
              <li className="first:pt-0 last:pb-0 py-8" key={room.id}>
                <div className="flex text-center items-center">
                  <p className="basis-3/5 font-medium">{room.number}</p>
                  <div>
                    <button
                      data-value1={room.id}
                      data-value2={room.number}
                      onClick={onButtonClick}
                      disabled={isActivitiesFetching}
                      style={{
                        cursor: isActivitiesFetching ? "wait" : "pointer",
                      }}
                      className="basis-2/5  px-8 py-2  transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"
                    >
                      Importuj plan
                    </button>
                    {isActivitiesFetching && clickedRoom.id == room.id && !allRoomsLoop && (
                      <p className="pt-2 font-normal">Importowanie planu</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {popupVisible && (
            <ConflictPopUp
              conflict={roomConflict}
              onClose={() => setPopupVisible(false)}
              deleteActivities={deleteActivities}
              roomName={clickedRoom.number}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ImportData;
