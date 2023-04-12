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
    return Api.get(`import/activity/${id}`).then((res) => res.data);
  }

  const {data: activities, isFetching: isRoomActivitiesFetching, refetch: refetchActivities } = useQuery<Activity[]>(["activities"], getRoomActivities, {
    refetchOnWindowFocus: false,
    enabled: true
  });

  useEffect(() => {
    refetchRoom();
    refetchActivities();
  }, []);


  return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-3">Sala</h1>
          {isRoomFetching ? (
              <p className="text-center">Ładowanie danych...</p>
          ) : (
              <div className="w-52 text-start">
                <p className="pb-8 text-4xl text-center font-bold">{room?.number}</p>

                <p className="mb-2 text-lg">
                  <span className="font-bold">Rodzaj: </span>
                  {room?.type=="didactics_room" ? "Sala dydaktyczna" : room?.type}
                </p>

                <p className="mb-2 text-lg">
                  <span className="font-bold">Pojemność: </span>
                  {room?.capacity}
                </p>
              </div>
          )}
        </div>
        <div>
          {isRoomActivitiesFetching? (
              <div className="">Ładowanie danych...</div>
          ) : (
              <div>
                <hr className="h-px my-3 bg-gray-200 border-0 h-0.5 dark:bg-gray-700"/>

                {activities?.map((activity) => (
                    <li className="first:pt-0 last:pb-0 py-8" key={activity.id}>
                      <div className="flex text-center items-center">
                        <p className="basis-3/5 font-medium">type: {activity.type}</p>
                        <p className="basis-3/5 font-medium">start: {activity.start_time}</p>
                        <p className="basis-3/5 font-medium">end: {activity.end_time}</p>
                        <p className="basis-3/5 font-medium">course: {activity.course_name["pl"]}</p>
                        <p className="basis-3/5 font-medium">classtype: {activity.classtype_name["pl"]}</p>

                        { Array.from(activity.lecturers).map((lecturer) => (
                            <li>
                              <p>{lecturer.first_name}</p>
                              <p>{lecturer.last_name}</p>
                            </li>
                        ))}

                        {/*<p className="basis-3/5 font-medium">lecturer: {activity.lecturers.}</p>*/}
                        <p className="basis-3/5 font-medium">group nr: {activity.group_number}</p>
                        <p className="basis-3/5 font-medium">room id: {activity.room_id}</p>
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
