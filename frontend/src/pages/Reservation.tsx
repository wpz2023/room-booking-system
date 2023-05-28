import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReservationData } from "../models/Reservation";
import Api from "../Api";
import { getRoomInfo } from "../utils/GetRoomInfo";
import { ReservationStatus } from "../utils/ReservationStatus";
import { ToastContainer, toast } from "react-toastify";
import ModifyReservationModal from "../components/ModifyReservationModal";
import { parseDateFromUTC } from "../utils/ParseDate";
import NewCalendar from "../components/Calendar";
import { Activity } from "../models/Activity";
import { mapActivitiesToEvents } from "../utils/MapActivitiesToEvents";
import { Views } from "react-big-calendar";

function Reservation() {
  const { id } = useParams();
  const [roomId, setRoomId] = useState<number | undefined>();
  const [reservation, setReservation] = useState<ReservationData>();
  const [reservationStatus, setReservationStatus] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  let token = window.sessionStorage.getItem("jwtToken");

  useEffect(() => {
    reservationQuery.refetch();
    if (reservationQuery.data != undefined) {
      reservationQuery.data.status = ReservationStatus.get(
        reservationQuery.data.status
      ) as string;
    }

    setReservation(reservationQuery.data);
  }, []);

  useEffect(() => {
    if (reservation?.status != "Otwarty") {
      setReservationStatus(false);
    } else {
      setReservationStatus(true);
    }
    setRoomId(reservation?.room_id);
  }, [reservation]);

  useEffect(() => {
    token = window.sessionStorage.getItem("jwtToken");
    reservationQuery.refetch();
    if (reservationQuery.data != undefined) {
      reservationQuery.data.status = ReservationStatus.get(
        reservationQuery.data.status
      ) as string;
    }
    setReservation(reservationQuery.data);
  }, [token]);

  useEffect(()=>{
    refetchActivities();
  }, [roomId])

  let getRoomActivities = () => {
    if(roomId === undefined) return [];
    return Api.Api.get(`activity/room/${roomId}`).then((res) => res.data);
  };

  let {
    data: activities,
    isFetching: isRoomActivitiesFetching,
    refetch: refetchActivities,
  } = useQuery<Activity[]>(["activities", roomId], getRoomActivities, {
    refetchOnWindowFocus: false,
    enabled: true,
  });
  
  const reservationActivity = {
    start_time: reservation?.start_time, end_time: reservation?.end_time, 
    course_name: {pl: reservation?.name}, classtype_name: [],
    group_number: undefined, 
    lecturers: [{first_name:reservation?.first_name, last_name: reservation?.last_name}]
  }
  const allActivities = activities?.concat([reservationActivity]);
  const roomActivities = mapActivitiesToEvents(allActivities as Activity[]);

  const reservationQuery = useQuery<ReservationData>({
    queryKey: ["reservation"],
    queryFn: async () =>
      await Api.authApi
        .get("reservation/manage/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
    enabled: true,
    onSuccess(data: ReservationData) {
      if (data != undefined) {
        data.status = ReservationStatus.get(data.status) as string;
        setReservation(data);
        setRoomId(data.room_id);
      }
    },
  });

  const room = getRoomInfo(roomId?.toString(), roomId != undefined);

  const modifyReservation = useMutation({
    mutationFn: async ({
      id,
      reservation,
    }: {
      id: string;
      reservation: ReservationData;
    }) => {
      const response = await Api.authApi.put(
        `reservation/manage/${id}`,
        {
          name: reservation.name,
          email: reservation.email,
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          start_time: parseDateFromUTC(
            new Date(reservation.start_time)
          ) as string,
          end_time: parseDateFromUTC(new Date(reservation.end_time)) as string,
          room_id: reservation.room_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      await reservationQuery.refetch();
      await room.refetch();
      toast.success("Rezerwacja została zmodyfikowana!");
    },
  });

  const declineReservation = useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.authApi.post(
        `reservation/manage/${id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      await reservationQuery.refetch();
      toast.success("Rezerwacja została odrzucona");
    },
  });

  const acceptReservation = useMutation({
    mutationFn: async (id: string) => {
      const response = await Api.authApi.post(
        `reservation/manage/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      await reservationQuery.refetch();
      toast.success("Rezerwacja została potwierdzona!");
    },
  });

  const handleDecline = () => {
    declineReservation.mutate(id as string);
  };

  const handleAccept = () => {
    acceptReservation.mutate(id as string);
  };

  const modify = (newReservation: ReservationData) => {
    setRoomId(newReservation.room_id);
    modifyReservation.mutate({
      id: newReservation.id,
      reservation: newReservation,
    });
    room.refetch();
    setPopupVisible(false);
  };

  const handleModification = () => {
    setPopupVisible(true);
  };

  return (
    <div className="mx-16 py-10">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">Rezerwacja o numerze {id}</h1>
      <div className="flex flex-col items-center text-center w-full">
        <div className="m-4 flex flex-row justify-between">
          <div className="">
            <div className="flex flex-row text-xl">
              <div className="font-medium">Tytuł zajęć: &nbsp;</div>
              <div className="">{reservation?.name}</div>
            </div>
            <div className="flex flex-row text-xl">
              <div className=" font-medium">Prowadzący:&nbsp; </div>
              <div className="">
                {reservation?.first_name} {reservation?.last_name}
              </div>
            </div>
            <div className="flex flex-row text-xl">
              <div className="font-medium">Email prowadzącego:&nbsp; </div>
              <div className="">{reservation?.email}</div>
            </div>
          </div>

          <div className="ml-10">
            <div className="flex flex-row text-xl">
              <div className="font-medium">Sala:&nbsp; </div>
              <div className=""> {room.data?.number}</div>
            </div>
            <div className="flex flex-row text-xl">
              <div className="font-medium">Czas rozpoczęcia zajęć: &nbsp;</div>
              <div className="">{reservation?.start_time}</div>
            </div>
            <div className="flex flex-row text-xl">
              <div className="font-medium"> Czas zakończenia zajęć:&nbsp; </div>
              <div className=""> {reservation?.end_time}</div>
            </div>
          </div>
        </div>
        <div className="space-x-4">
          <div className="flex flex-row text-xl justify-center">
            <div className="font-medium"> Status: &nbsp; </div>
            <div className=""> {reservation?.status}</div>
          </div>
          {reservationStatus && (
            <div className="mt-6">
              <button
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md mr-2 text-lg"
                onClick={handleDecline}
              >
                Odrzuć
              </button>
              <button
                className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md mr-2 text-lg"
                onClick={handleModification}
              >
                Modyfikuj
              </button>
              <button
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md text-lg"
                onClick={handleAccept}
              >
                Zatwierdź
              </button>
            </div>
          )}
        </div>
      </div>
      {popupVisible && (
        <ModifyReservationModal
          onClose={() => setPopupVisible(false)}
          reservation={reservation as ReservationData}
          modify={modify}
        />
      )}

      <div>
        {isRoomActivitiesFetching ? (
          <div className="mt-8 text-center">Ładowanie danych...</div>
        ) : (
          <div>
            <div className="m-auto flex flex-col my-8 w-60">
              <hr className="h-px my-8 bg-gray-200 border-0 h-0.5 dark:bg-gray-700" />
              <div>
                <NewCalendar
                  activities={roomActivities}
                  defaultView={Views.DAY}
                  defaultDate={reservation?.start_time}
                  views={[Views.DAY]}
                  minDate={new Date(0, 0, 0, 6, 0, 0)}
                  maxDate={new Date(0, 0, 0, 22, 0, 0)}
                  toolbar={true}
                  step={15}
                  selectable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservation;
