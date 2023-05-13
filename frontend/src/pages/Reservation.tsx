import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReservationData } from "../models/Activity";
import Api from "../Api";
import { getRoomInfo } from "../utils/GetRoomInfo";
import { ReservationStatus } from "../utils/ReservationStatus";

function Reservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState<ReservationData>();
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
    token = window.sessionStorage.getItem("jwtToken");
    reservationQuery.refetch();
    if (reservationQuery.data != undefined) {
      reservationQuery.data.status = ReservationStatus.get(
        reservationQuery.data.status
      ) as string;
    }
    setReservation(reservationQuery.data);
  }, [token]);

  const reservationQuery = useQuery<ReservationData>({
    queryKey: ["reservation"],
    queryFn: () =>
      Api.authApi
        .get("reservation/manage/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
    enabled: true,
    onSuccess(data) {
      if (data != undefined) {
        data.status = ReservationStatus.get(data.status) as string;
      }
      setReservation(data);
    },
  });

  const room = getRoomInfo(
    reservation?.room_id.toString(),
    !!reservation?.room_id
  );

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
  });

  const handleDecline = () => {
    declineReservation.mutate(id as string);
    reservationQuery.refetch();
  };

  const handleAccept = () => {
    acceptReservation.mutate(id as string);
    reservationQuery.refetch();
  };

  return (
    <div className="mx-16 py-10">
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
          {reservation?.status == "open" && (
            <div className="mt-6">
              <button
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md mr-2 text-lg"
                onClick={handleDecline}
              >
                Odrzuć
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
    </div>
  );
}

export default Reservation;
