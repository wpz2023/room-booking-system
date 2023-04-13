import React, {useEffect} from "react";
import { useParams } from "react-router";
import {useQuery} from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import {Calendar, Views} from 'react-big-calendar';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { pl } from "date-fns/locale";



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


  // moment.locale("pl");
  // const localizer = momentLocalizer(moment); // set the moment.js localizer to use the Polish locale

  // const events: Event[] = [
  //   // Add your calendar events here
  // ];
  //
  // const handleSelectSlot = (slotInfo: any) => {
  //   console.log(slotInfo.start);
  // };
  //
  // const handleSelectEvent = (event: any) => {
  //   console.log(event.title);
  // };

  const locales = {
      pl: pl,
  };

  const localizer = dateFnsLocalizer({
      format,
      parse,
      startOfWeek,
      getDay,
      locales,
  });

  const events = [
      {
          title: "Big Meeting",
          allDay: true,
          start: new Date(2022, 4, 12, 5,0,0),
          end: new Date(2022, 4, 12,7,0,0),
      },
      {
          title: "Vacation",
          start: new Date(2021, 6, 7),
          end: new Date(2021, 6, 10),
      },
      {
          title: "Conference",
          start: new Date(2021, 6, 20),
          end: new Date(2021, 6, 23),
      },
  ];



  return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4">Sala</h1>
          {isRoomFetching ? (
              <p className="text-center">Ładowanie danych...</p>
          ) : (
              <div className="w-52 text-start">
                <p className="pb-4 text-4xl text-center font-bold">{room?.number}</p>

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
              <div className="mt-8 text-center">Ładowanie danych...</div>
          ) : (
              <div className="mx-20">
                  <hr className="h-px my-8 bg-gray-200 border-0 h-0.5 dark:bg-gray-700"/>
                  <Calendar
                      culture={"pl"}
                      localizer={localizer}
                      events={events}
                      defaultView={Views.WEEK}
                      views={[Views.DAY, Views.WEEK, Views.MONTH]}
                      step={15}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: '100vh' }}
                      min={new Date(0, 0, 0, 7, 0, 0)}
                      max={new Date(0, 0, 0, 20, 0, 0)}
                      messages={{
                          allDay: 'Cały dzień',
                          previous: 'Poprzedni',
                          next: 'Następny',
                          today: 'Dziś',
                          month: 'Miesiąc',
                          week: 'Tydzień',
                          day: 'Dzień',
                          date: 'Data',
                          time: 'Czas',
                          event: 'Wydarzenie',
                      }}
                  />
              </div>

              // <div>
              //
              //
              //   {activities?.map((activity) => (
              //       <li className="first:pt-0 last:pb-0 py-8" key={activity.id}>
              //         <div className="flex text-center items-center">
              //           <p className="basis-3/5 font-medium">type: {activity.type}</p>
              //           <p className="basis-3/5 font-medium">start: {activity.start_time}</p>
              //           <p className="basis-3/5 font-medium">end: {activity.end_time}</p>
              //           <p className="basis-3/5 font-medium">course: {activity.course_name["pl"]}</p>
              //           <p className="basis-3/5 font-medium">classtype: {activity.classtype_name["pl"]}</p>
              //
              //           { Array.from(activity.lecturers).map((lecturer) => (
              //               <li>
              //                 <p>{lecturer.first_name}</p>
              //                 <p>{lecturer.last_name}</p>
              //               </li>
              //           ))}
              //
              //           {/*<p className="basis-3/5 font-medium">lecturer: {activity.lecturers.}</p>*/}
              //           <p className="basis-3/5 font-medium">group nr: {activity.group_number}</p>
              //           <p className="basis-3/5 font-medium">room id: {activity.room_id}</p>
              //         </div>
              //       </li>
              //   ))}
              // </div>
          )
          }
        </div>
      </div>

  );
}

export default Room;
