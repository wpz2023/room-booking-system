import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Api from "../Api";

interface ReservationFormProps {
  roomdId: string | undefined;
  startTime: string;
  endTime: string;
}

type FormValues = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  startTime: Date;
  endTime: Date;
};

const ReservationForm: React.FC<ReservationFormProps> = ({
  roomdId,
  startTime,
  endTime,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      firstName: "",
      lastName: "",
      startTime: new Date(),
      endTime: new Date(),
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const reserve = useMutation({
    mutationFn: async (formValues: FormValues) => {
      const data = await Api.Api.post("reservation", {
        name: formValues.name,
        email: formValues.email,
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        start_time: formValues.startTime,
        end_time: formValues.endTime,
        room_id: roomdId,
      }).then((res) => res.data);
      return data;
    },
  });

  const onSubmit = async (data: FormValues) => {
    // await reserve.mutate(data);
    console.log(data);
  };

  return (
    <div className="m-10">
      <div className="text-center text-2xl font-medium">Dane rezerwacji</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-5 flex flex-col items-center"
      >
        <label className="py-2" htmlFor="courseName">
          Nazwa przedmiotu
        </label>
        <input
          placeholder={"Przedmiot"}
          className="py-2"
          type="text"
          id="courseName"
          {...register("name", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.name?.message}</p>
        <label htmlFor="email">Email</label>
        <input
          placeholder={"adres@email"}
          type="email"
          id="email"
          {...register("email", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.email?.message}</p>
        <label htmlFor="firstName">Imię prowadzącego</label>
        <input
          placeholder={"imie"}
          type="text"
          id="firsName"
          {...register("firstName", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.firstName?.message}</p>
        <label htmlFor="lastName">Nazwisko prowadzącego</label>
        <input
          placeholder={"nazwisko"}
          type="text"
          id="lastName"
          {...register("lastName", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.lastName?.message}</p>
        <label htmlFor="startTime">Data rozpoczęcia zajęć</label>
        <input
          type="date"
          id="startTime"
          {...register("startTime", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.startTime?.message}</p>
        <label htmlFor="startTime">Data końca zajęć</label>
        <input
          type="date"
          id="endTime"
          {...register("endTime", {
            required: { value: true, message: "Pole wymagane" },
          })}
        />
        <p className=" text-red-700">{errors.endTime?.message}</p>
        <input type="submit" />
      </form>
    </div>
  );
};

export default ReservationForm;
