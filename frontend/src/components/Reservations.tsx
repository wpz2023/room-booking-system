import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Api from "../Api";
import { ReservationData } from "../models/Activity";
import { Link, useNavigate } from "react-router-dom";

function Reservations() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("jwtToken");
  const reservations = useQuery<ReservationData[]>({
    queryKey: ["reservations"],
    queryFn: () =>
      Api.authApi
        .get("reservation/manage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
    enabled: true,
  });

  useEffect(() => {
    reservations.refetch();
  }, [token]);

  const handleClick = (id: string) => {
    navigate("/rezerwacja/" + id);
  };

  console.log(reservations.data);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Lista rezerwacji</h1>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Tytuł zajęć</th>
              <th className="border p-2">Prowadzący</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Czas rozpoczęcia</th>
              <th className="border p-2">Czas zakończenia</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          {reservations.isFetching ? (
            <div className="">Ładowanie...</div>
          ) : (
            <tbody>
              {reservations.data?.map((reservation) => (
                <tr
                  className="bg-white"
                  key={reservation.id}
                  onClick={() => handleClick(reservation.id)}
                >
                  <td className="border p-2">{reservation.name}</td>
                  <td className="border p-2">
                    {reservation.first_name + " " + reservation.last_name}
                  </td>
                  <td className="border p-2">{reservation.email}</td>
                  <td className="border p-2">{reservation.start_time}</td>
                  <td className="border p-2">{reservation.end_time}</td>
                  <td className="border p-2">{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default Reservations;
