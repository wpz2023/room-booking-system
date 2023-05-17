import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { ReservationData } from "../models/Reservation";
import Api from "../Api";
import { Room } from "../models/Room";
import { useQuery } from "@tanstack/react-query";
import { parseDateFromUTC, parseStringToUTC } from "../utils/ParseDate";

function ModifyReservationModal({
  onClose,
  reservation,
  modify,
}: {
  onClose: () => void;
  reservation: ReservationData;
  modify: (reservation: ReservationData) => void;
}) {
  const [newReservation, setNewReservation] = useState(reservation);
  const [startDate, setStartDate] = useState<Date | null>(parseStringToUTC(reservation.start_time));
  const [endDate, setEndDate] = useState<Date | null>(parseStringToUTC(reservation.end_time));
  const [className, setClassName] = useState(reservation.name);
  const [room, setRoom] = useState(reservation.room_id);

  const roomsQuery = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => {
      return Api.Api.get("room").then((res) => res.data);
    },
    enabled: true,
  });

  useEffect(() => {
    setNewReservation({
      ...newReservation,
      start_time: parseDateFromUTC(startDate as Date) as string,
      end_time: parseDateFromUTC(endDate as Date) as string,
      name: className,
      room_id: room,
    });
  }, [startDate, endDate, className, room]);

  const startDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const endDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const roomChange = (e) => {
    e.preventDefault();
    setRoom(e.target.value);
    setNewReservation({ ...newReservation, room_id: e.target.key });
  };

  const classNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setClassName(event.currentTarget.value);
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-3xl font-bold leading-6 text-gray-900">
                    Modyfikuj rezerwacje
                  </h3>
                  <div className="mt-10">
                    <div className="">
                      <div className="flex">
                        <label
                          className="mb-3 block text-base font-medium text-[#07074D] mr-3"
                          htmlFor="startDate"
                        >
                          Rozpoczęcie zajęć:
                        </label>
                        <DateTimePicker
                          id={"startDate"}
                          value={startDate}
                          onChange={startDateChange}
                        />
                      </div>
                      <div className="flex ">
                        <label
                          className="mb-3 block text-base font-medium text-[#07074D] mr-3"
                          htmlFor="endDate"
                        >
                          Zakończenie zajęć:
                        </label>
                        <DateTimePicker
                          id={"endDate"}
                          value={endDate}
                          onChange={endDateChange}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="mb-3 block text-base font-medium text-[#07074D]"
                        htmlFor="courseName"
                      >
                        Nazwa przedmiotu
                      </label>
                      <input
                        placeholder={"Przedmiot"}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-sky-500 focus:shadow-md"
                        type="text"
                        id="courseName"
                        value={className}
                        onChange={classNameChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="mb-3 block text-base font-medium text-[#07074D]">
                        Sala:
                        <select
                          value={room}
                          onChange={roomChange}
                          className="ml-1  font-normal text-center px-1 border-b-2 border-blue-500
                                    hover:border-2 hover:border-blue-500 hover:rounded-md  focus:border-2
                                    focus:border-blue-500 focus:rounded-md outline-none "
                        >
                          {roomsQuery?.data?.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.number}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => modify(newReservation)}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Modyfikuj i zatwierdź
              </button>
              <button
                onClick={onClose}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyReservationModal;
