import React, {useEffect} from "react";
import { useParams } from "react-router";
import {useQuery} from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";

function Room() {
  const { id } = useParams();

  const getRoomInfo = () => {
    return Api.get(`room/${id}`).then((res) => res.data);
  }

  const {data: room, isFetching: isRoomFetching, refetch: refetchRoom } = useQuery<RoomData>(["room_info"], getRoomInfo, {
    refetchOnWindowFocus: false,
    enabled: true
  });

  const getRoomActivities = () => {
    return Api.get(`activity/room/${id}`).then((res) => res.data);
  }

  const {data: activities, isFetching: isRoomActivitiesFetching, refetch: refetchActivities } = useQuery<Activity[]>(["activities"], getRoomActivities, {
    refetchOnWindowFocus: false,
    enabled: true
  });

  useEffect(() => {
    refetchRoom();
    refetchActivities();
  }, []);

  // const activities = useQuery<Activity[]>({
  //   queryKey: ["activities"],
  //   queryFn: () => Api.get(`activity/room/${id}`).then((res) => res.data),
  // });

  console.log(activities);

  return (
      <div>
        <div className="container mx-auto py-10">
          {isRoomFetching ? (
              <div className="">Ładowanie danych...</div>
          ) : (
              <div>
                <h1 className="p-6">Room {id}</h1>
                <h1 className="p-6">ID: {room?.number}</h1>
                <h1 className="p-6">Typ: {room?.type=="didactics_room" ? "Sala dydaktyczna" : room?.type}</h1>
                <h1 className="p-6">Pojemność: {room?.capacity}</h1>
                <br/>
              </div>
          )}
        </div>
        <div>
          <p>tutaj sie zaczyna zabawa</p>
          {isRoomActivitiesFetching? (
              <div className="">Ładowanie danych...</div>
          ) : (
              <div>
                {activities?.map((activity) => (
                    <li className="first:pt-0 last:pb-0 py-8" key={activity.id}>
                      <div className="flex text-center items-center">
                        <p className="basis-3/5 font-medium">cos {activity.id}</p>
                      </div>
                    </li>
                ))}
              </div>
          )}
        </div>
      </div>

  );
}

export default Room;
