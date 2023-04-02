import { useQuery } from "@tanstack/react-query";
import { RoomData } from "../models/Room";
import Api from "../Api";
import { Link } from "react-router-dom";

function Rooms() {
  const roomsQuery = useQuery<RoomData[]>({
    queryKey: ["rooms"],
    queryFn: () => Api.get("room").then((res) => res.data),
  });

  roomsQuery.data?.forEach((room) => (room.type = "Sala dydatkyczna"));
  return (
    <div className="p-6">
      {roomsQuery.isFetching ? (
        <div className="">Loading...</div>
      ) : (
        <ul className="">
          {roomsQuery.data?.map((room) => (
            <li className="" key={room.id}>
              <div className="flex justify-evenly">
                <Link to={room.id.toString()}>{room.number}</Link>
                <div className="">{room.type}</div>
                <div className="">{room.capacity}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Rooms;
