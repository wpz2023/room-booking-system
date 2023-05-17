import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Api from "../Api";
import { ReservationData } from "../models/Activity";
import ReservationsTable from "./ReservationsTable";

function Reservations() {
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Lista rezerwacji</h1>
      <div className="overflow-x-auto">
  
        {reservations.isFetching ? (
            <div className="">Ładowanie...</div>
          ) : (
            <ReservationsTable data={reservations.data} />
        )}

      </div>
    </div>
  );
}

export default Reservations;
