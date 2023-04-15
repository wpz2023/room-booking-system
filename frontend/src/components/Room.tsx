import React, {useEffect} from "react";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import {Calendar, Views} from 'react-big-calendar';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {dateFnsLocalizer} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import {pl} from "date-fns/locale";
import {Lecturer} from "../models/Lecturer";


interface EventData {
    start: Date;
    end: Date;
    course_name: Map<string, string>;
    classtype_name: Map<string, string>;
    group_number: number;
    lecturers: Set<Lecturer>;
}

interface EventProps {
    event: EventData;
    titleAccessor: keyof EventData;
    startAccessor: keyof EventData;
    endAccessor: keyof EventData;
    allDayAccessor: keyof EventData;
    tooltipAccessor?: keyof EventData;
    children?: React.ReactNode;
}


const Event: React.FC<EventProps> = ({ event, titleAccessor, startAccessor, endAccessor, allDayAccessor, tooltipAccessor, children }) => {
    return (
        <div className="rbc-event-content flex flex-col text-center">
            {/*<div className="rbc-event-title">{event[titleAccessor]}</div>*/}
            {event.classtype_name && event.group_number &&
                <div className="py-1 rbc-event-location">{event.classtype_name["pl"]}, gr.{event.group_number}</div>}
            {event.course_name && <div className="pt-1 rbc-event-description">{event.course_name["pl"]} - </div>}
            { Array.from(event.lecturers).map((lecturer) => (
                  <p>{lecturer.first_name} {lecturer.last_name}</p>
            ))}
            {children}
        </div>
    );
};

const tooltipAccessor: React.FC<EventProps> =({ event, titleAccessor, startAccessor, endAccessor, allDayAccessor, tooltipAccessor, children }) => {
    return (
        <div className="rbc-event-content flex flex-col text-center">
            {/*<div className="rbc-event-title">{event[titleAccessor]}</div>*/}
            {event.classtype_name && event.group_number &&
                <div className="py-1 rbc-event-location">{event.classtype_name["pl"]}, gr.{event.group_number}</div>}
            {event.course_name && <div className="pt-1 rbc-event-description">{event.course_name["pl"]} - </div>}
            { Array.from(event.lecturers).map((lecturer) => (
                <p>{lecturer.first_name} {lecturer.last_name}</p>
            ))}
            {children}
        </div>
    );
};


function Room() {
    const {id} = useParams();

    const getRoomInfo = () => {
        return Api.get(`room/${id}`).then((res) => res.data);
    }

    const {
        data: room,
        isFetching: isRoomFetching,
        refetch: refetchRoom
    } = useQuery<RoomData>(["room_info"], getRoomInfo, {
        refetchOnWindowFocus: false,
        enabled: true
    });

    const getRoomActivities = () => {
        return Api.get(`import/activity/${id}`).then((res) => res.data);
    }

    const {
        data: activities,
        isFetching: isRoomActivitiesFetching,
        refetch: refetchActivities
    } = useQuery<Activity[]>(["activities"], getRoomActivities, {
        refetchOnWindowFocus: false,
        enabled: true
    });

    useEffect(() => {
        refetchRoom();
        refetchActivities();
    }, []);


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

    const roomActivities = activities?.map(activity => ({
        ...activity,
         start: new Date(Number(activity.start_time.substring(0,4)), //year
            Number(activity.start_time.substring(5,7))-1, // month
            Number(activity.start_time.substring(8,10)), // day
            Number(activity.start_time.substring(11,13)), // hour
            Number(activity.start_time.substring(14,16)), // minute
            ),

        end: new Date(Number(activity.end_time.substring(0,4)), //year
            Number(activity.end_time.substring(5,7))-1, // month
            Number(activity.end_time.substring(8,10)), // day
            Number(activity.end_time.substring(11,13)), // hour
            Number(activity.end_time.substring(14,16)), // minute
        ),
        course_name: activity.course_name,
        classtype_name: activity.classtype_name,
        group_number: activity.group_number,
        lecturers: activity.lecturers,
    } ));

    console.log(roomActivities);



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
                            {room?.type == "didactics_room" ? "Sala dydaktyczna" : room?.type}
                        </p>

                        <p className="mb-2 text-lg">
                            <span className="font-bold">Pojemność: </span>
                            {room?.capacity}
                        </p>
                    </div>
                )}
            </div>

            <div>
                {isRoomActivitiesFetching ? (
                    <div className="mt-8 text-center">Ładowanie danych...</div>
                ) : (
                    <div className="mx-32">
                        <hr className="h-px my-8 bg-gray-200 border-0 h-0.5 dark:bg-gray-700"/>
                        <Calendar
                            culture={"pl"}
                            localizer={localizer}
                            events={roomActivities}
                            defaultView={Views.WEEK}
                            views={[Views.WEEK]}
                            components={{
                                event: Event
                            }}
                            step={15}
                            timeslots={4}
                            // tooltipAccessor={tooltipAccessor}
                            dayLayoutAlgorithm="no-overlap"
                            startAccessor="start"
                            endAccessor="end"
                            style={{height: '100vh'}}
                            min={new Date(0, 0, 0, 6, 0, 0)}
                            max={new Date(0, 0, 0, 22, 0, 0)}
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
                )}
            </div>
        </div>

    );
}

export default Room;
