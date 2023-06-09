import React, { useEffect, useState } from "react";
import { RoomData } from "../models/Room";
import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../Api";
import ConflictPopUp from "../components/ConflictPopUp";
import { Conflict } from "../models/Conflict";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Activity} from "../models/Activity";

function ImportData() {
  const token = window.localStorage.getItem("jwtToken");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [unresolvedPopupVisible, setUnresolvedPopupVisible] = useState<boolean>(false);
  const [activitiesToDelete, setActivitiesToDelete] = useState<string[]>([]);
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<Conflict>();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loopIndex, setLoopIndex] = useState<number>(-1);
  const [isImportLoop, setIsImportLoop] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData>({
    capacity: 0,
    roomAnnotation: undefined,
    type: "",
    id: 0,
    number: 0,
  });

  useEffect(() => {
    if (loopIndex >= 0 && loopIndex < rooms.length){
      setSelectedRoom({
        ...selectedRoom,
        id: rooms[loopIndex].id,
        number: rooms[loopIndex].number,
      });
    } else {
      setLoopIndex(-1)
      setIsImportLoop(false)
    }
  }, [loopIndex])

  useEffect(() => {
    if (activitiesToDelete.length > 0) {
      mutate(selectedRoom.id);
    } else {
      if (loopIndex >= 0 && !popupVisible){
        setLoopIndex(loopIndex + 1)
      }
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
          if(!isImportLoop){
            toast.success("Udało się zaimportować plan sali");
          } else if (loopIndex == rooms.length-1){
            toast.success("Udało się zaimportować plany wszystkich sal");
          }
        }
      },
    }
  );

  const { mutate: unresolvedMutate} = useMutation<Conflict, string[]>(
      async (unresolvedConflictsToDelete: string[]) => {
        const response = await Api.authApi.post(
            `activity/conflicts`,
            unresolvedConflictsToDelete,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setUnresolvedConflicts(response.data);
        return response.data;
      },
      {
        onSuccess: (responseData) => {
          if (responseData) {
            setUnresolvedPopupVisible(true);
          }
        },
      }
  );

  const getRoomActivities = async () => {
    if (selectedRoom.id != 0) {
      return await Api.authApi
        .get(`import/activity/${selectedRoom.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .finally(async () => await mutate(selectedRoom.id));
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
  }, [selectedRoom]);

  const getImportRooms = () => {
    return Api.authApi
      .get("import/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRooms(res.data)
        return res.data
      });
  };

  const { isFetching, data, refetch } = useQuery<RoomData[]>(
    ["data"],
    getImportRooms,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const roomsQuery = useQuery<RoomData[]>({
    queryKey: ["rooms"],
    queryFn: () => {
      return Api.Api.get("room")
          .then((res) => {
            setRooms(res.data)
            return res.data
          })
    },
    enabled: true,
  });

  useEffect(() => {
    roomsQuery.refetch();
    getUnresolvedConflicts();
  }, [token]);

  const getUnresolvedConflicts = () => {
    return Api.authApi
        .post("activity/conflicts", [], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUnresolvedConflicts(res.data));
  };

  const handleClick = () => {
    refetch();
  };

  const onButtonClick = (e) => {
    e.preventDefault();
    setSelectedRoom({
      ...selectedRoom,
      id: e.currentTarget.dataset.value1,
      number: e.currentTarget.dataset.value2,
    });
  };

  const deleteActivities = (activities: string[]) => {
    setActivitiesToDelete(activities);
  };

  const deleteUnresolvedActivities = (activities: string[]) => {
    unresolvedMutate(activities);
  };

  const importAllRoomsActivities = (e) => {
    e.preventDefault();
    setIsImportLoop(true)
    setLoopIndex(0)
  }

  const handleResolvingConflicts = (e) => {
    e.preventDefault();
    setUnresolvedPopupVisible(true);
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-6">
      <ToastContainer />
      {unresolvedConflicts && (
        <div role="alert" className="w-1/3 pb-14 text-center">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-xl">
            Nierozwiązane konflikty
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p className="text-xl">W systemie znajdują się nierozwiązane konflikty.</p>
            <button
              onClick={handleResolvingConflicts}
              disabled={isActivitiesFetching}
              style={{
                cursor: isActivitiesFetching ? "wait" : "pointer",
              }}
              className="w-2/5 px-4 py-3 mt-3 mb-1 transition hover:scale-110 delay-150 rounded-lg
              bg-red-500 hover:bg-red-700 text-white">
              Rozwiąż konflikty
            </button>
          </div>
        </div>
      )}

      <div className="w-2/5 pb-14 text-center text-2xl font-medium">
        <p>Import danych</p>
      </div>
      <div className="w-[450px] flex flex-col items-center">
        <button
            onClick={handleClick}
            disabled={isActivitiesFetching}
            style={{
              cursor: isActivitiesFetching ? "wait" : "pointer",
            }}
            className="w-2/5 px-4 py-3 mb-14 transition hover:scale-110 delay-150 rounded-lg
                bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
          Importuj sale
        </button>
      </div>
      {isFetching ? (
        <p>Ładowanie danych</p>
      ) : (
        <div>
          {rooms.length > 0 && (
            <div>
              <div className="flex flex-col items-center mb-3">
                <button
                  onClick={importAllRoomsActivities}
                  disabled={isActivitiesFetching}
                  style={{
                    cursor: isActivitiesFetching ? "wait" : "pointer",
                  }}
                  className="px-4 py-2 mb-3 w-2/5 transition hover:scale-110 delay-150 rounded-lg
                     bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
                  Importuj plany wszystkich sal
                </button>
                { isImportLoop && (
                    <p className="mb-2 font-normal text-center">Importowanie planów</p>
                )}
              </div>

              <div className="w-[450px] px-6 flex flex-col">
                <div className="flex flex-row items-end">
                  <p className="basis-3/5 font-medium">Numer sali</p>
                </div>
                <hr className="h-px my-3 bg-gray-200 border-0 h-0.5 dark:bg-gray-700" />
              </div>
            </div>
          )}
          <ul role="list" className="w-full p-6 divide-y divide-slate-200 mt-2">
            {rooms.map((room) => (
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
                    {isActivitiesFetching && selectedRoom.id == room.id && !isImportLoop && (
                        <p className="font-normal">Importowanie planu</p>
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
              roomName={selectedRoom.number}
            />
          )}
          {unresolvedPopupVisible && (
              <ConflictPopUp
                  conflict={unresolvedConflicts}
                  onClose={() => setUnresolvedPopupVisible(false)}
                  deleteActivities={deleteUnresolvedActivities}
                  roomName={rooms.find((room) => room.id === unresolvedConflicts?.userActivity.room_id)?.number}
              />
          )}
        </div>
      )}
    </div>
  );
}

export default ImportData;
