import { useQuery } from "@tanstack/react-query";
import { RoomData } from "../models/Room";
import Api from "../Api";
import { Link } from "react-router-dom";

function Rooms() {
  const roomsQuery = useQuery<RoomData[]>({
    queryKey: ["rooms"],
    queryFn: () => Api.get("room").then((res) => res.data),
  });

  roomsQuery.data?.forEach((room) => (room.type = "Sala dydaktyczna"));
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Lista sal</h1>
      {roomsQuery.isFetching ? (
        <div className="">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {roomsQuery.data?.map((room) => (
            <Link to={room.id.toString()}>
              <div className="bg-gray-200 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4">{room.number}</h2>
                <p className="text-sm mb-2">
                  <span className="font-bold">Rodzaj:</span> {room.annotation}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-bold">Pojemność:</span> {room.capacity}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
