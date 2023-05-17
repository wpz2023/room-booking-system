import React, { useEffect, useState } from "react";
import { RoomData } from "../models/Room";
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../Api";
import ConflictPopUp from "../components/ConflictPopUp";
import { Conflict } from "../models/Conflict";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ImportData() {
  const token = window.sessionStorage.getItem("jwtToken");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [activitiesToDelete, setActivitiesToDelete] = useState<string[]>([]);
  const [clickedRoom, setRoom] = useState<RoomData>({
    capacity: 0,
    roomAnnotation: undefined,
    type: "",
    id: 0,
    number: 0,
  });

  useEffect(() => {
    if (activitiesToDelete.length > 0) {
      mutate(clickedRoom.id);
    }
  }, [activitiesToDelete]);

  const { mutate, data: roomConflict } = useMutation<Conflict>(
    async (id) => {
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
          setPopupVisible(true);
        } else {
          toast.success("Udało się zaimportować plan sali");
        }
      },
    }
  );

  const getRoomActivities = async () => {
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
                    {isActivitiesFetching && clickedRoom.id == room.id && (
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