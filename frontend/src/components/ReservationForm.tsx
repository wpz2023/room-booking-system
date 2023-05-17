import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import Api from "../Api";
import { BackgroundEvent } from "./Calendar";
import { parseDateFromUTC } from "../utils/ParseDate";

type FormValues = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
};

function ReservationForm({
  roomId,
  event,
}: {
  roomId: string | undefined;
  event: BackgroundEvent | undefined;
}) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const [calendarWarning, setCalendarWarning] = useState(true);

  const reserve = useMutation({
    mutationFn: async ({
      formValues,
      start,
      end,
    }: {
      formValues: FormValues;
      start: string;
      end: string;
    }) => {
      const data = await Api.Api.post("reservation", {
        name: formValues.name,
        email: formValues.email,
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        start_time: start,
        end_time: end,
        room_id: roomId,
      }).then((res) => res.data);
      return data;
    },
    onSuccess: () => {
      toast.success("Udało ci się stworzyć rezerwację!");
      reset();
    },
    onError: () => {
      toast.info("Nie udało się stworzyć rezerwacji");
    },
  });

  const onSubmit = async (
    data: FormValues,
    eventForm: React.FormEvent<HTMLFormElement>
  ) => {
    eventForm.preventDefault();
    if (event?.start === undefined) {
      setCalendarWarning(false);
    } else {
      setCalendarWarning(true);
      const start = parseDateFromUTC(event?.start) as string;
      const end = parseDateFromUTC(event?.end) as string;

      await reserve.mutate({ formValues: data, start, end });
    }
  };

  return (
    <div className="m-10">
      <ToastContainer />
      {!calendarWarning && (
        <p className=" text-red-700 font-big text-xl">
          "Proszę zaznaczyć zajęcia na kalendarzu"
        </p>
      )}
      <div className="text-center text-2xl font-bold">Dane rezerwacji</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center flex-col pt-10">
          <div className="flex justify-between">
            <div className="mb-5 mr-5">
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
                {...register("name", {
                  required: { value: true, message: "Pole wymagane" },
                })}
              />
              <p className=" text-red-700">{errors.name?.message}</p>
            </div>
            <div className="mb-5 mr-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Email
              </label>
              <input
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-sky-500 focus:shadow-md"
                placeholder={"adres@email"}
                type="email"
                id="email"
                {...register("email", {
                  required: { value: true, message: "Pole wymagane" },
                })}
              />
              <p className=" text-red-700">{errors.email?.message}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-5 mr-5">
              <label
                htmlFor="firstName"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Imię prowadzącego
              </label>
              <input
                className="rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-sky-500 focus:shadow-md"
                placeholder={"imie"}
                type="text"
                id="firsName"
                {...register("firstName", {
                  required: { value: true, message: "Pole wymagane" },
                })}
              />
              <p className=" text-red-700">{errors.firstName?.message}</p>
            </div>
            <div className="mb-5 mr-5">
              <label
                htmlFor="lastName"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nazwisko prowadzącego
              </label>
              <input
                className="rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-sky-500 focus:shadow-md"
                placeholder={"nazwisko"}
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: { value: true, message: "Pole wymagane" },
                })}
              />
              <p className=" text-red-700">{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="">
            <input
              type="submit"
              className="hover:shadow-form rounded-md bg-sky-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
