import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import {Calendar, DateLocalizer, View, Views} from 'react-big-calendar';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import {pl} from "date-fns/locale";
import {Lecturer} from "../models/Lecturer";


// model rezerwacji do wyświetlenia w kalendarzu
interface EventData {
    start: Date;
    end: Date;
    course_name: Map<string, string>;
    classtype_name: Map<string, string>;
    group_number: number;
    lecturers: Set<Lecturer>;
    text: string;
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


// ustawienie zawartości eventu do wyświetlenia w kalendarzu oraz dostasowanie rozmiaru tekstu
const Event: React.FC<EventProps> = ({ event, titleAccessor, startAccessor, endAccessor, allDayAccessor, tooltipAccessor, children }) => {
    const eventRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (eventRef.current) {
            const eventElement = eventRef.current;
            const eventHeight = eventElement.offsetHeight;
            const eventWidth = eventElement.offsetWidth;
            // const scaleFactor =  Math.min(eventHeight / 100, eventWidth / 180); // dla szerokich niskich
            const scaleFactor =  Math.max(Math.min(eventHeight / 120, eventWidth / 210), Math.min(eventHeight / 210, eventWidth / 120)) ;
            const fontSize = 16 * scaleFactor;

            eventRef.current.style.fontSize = `${fontSize}px`;
        }
    }, []);

    return (
        <div className="rbc-event-content text-center grid content-center " ref={eventRef}>
            {event.classtype_name && event.group_number &&
                <div className="mb-1.5 rbc-event-location">
                    { event.classtype_name["pl"]}, gr.{event.group_number}
                </div>}
            {event.course_name &&
                <div className="rbc-event-description">
                    {event.course_name["pl"]} -
                </div>}
            { Array.from(event.lecturers).map((lecturer) => (
                  <p>{lecturer.first_name} {lecturer.last_name}</p>
            ))}
            {children}
        </div>
    );
};


type MyCalendarProps = {
    events: EventData[];
};

function Room() {
    const {id} = useParams();

    const getRoomInfo = () => {
        return Api.get(`room/${id}`).then((res) => res.data);
    }

    // zmienne do zarządzania informacjami nt. sali
    const {
        data: room,
        isFetching: isRoomFetching,
        refetch: refetchRoom
    } = useQuery<RoomData>(["room_info"], getRoomInfo, {
        refetchOnWindowFocus: false,
        enabled: true
    });

    const getRoomActivities = () => {
        console.log("DATA:" +  currentDate)
        // return Api.get(`import/activity/${id}`).then((res) => res.data);
        // return Api.get(`activity/room/${id}/week?startTime=2023-04-17`).then((res) => res.data);
        return Api.get(`activity/room/${id}/week?startTime=${currentDate}`).then((res) => res.data);
    }

    // dane do zarządzania informacjami nt. rezerwacji danej sali
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


    // ustawienie języka
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


    // zmiana nazwy typu zajęć na krótszą formę
    const changeClasstypeName = (classType: Map<string, string>) => {
        if (classType["pl"]=="Wykład"){
            classType["pl"] = "WYK"
        } else if (classType["pl"]=="Ćwiczenia"){
            classType["pl"] =  "CW"
        } else if (classType["pl"]=="Konwersatorium"){
            classType["pl"] = "KON"
        } else if (classType["pl"]=="Laboratorium"){
            classType["pl"] = "LAB"
        } else if (classType["pl"]=="Seminarium"){
            classType["pl"] = "SEM"
        } else if (classType["pl"]=="Pracownia"){
            classType["pl"] = "PRA"
        } else if (classType["pl"]=="Pracownia komputerowa"){
            classType["pl"] = "PKO"
        } else if (classType["pl"]=="Lektorat"){
            classType["pl"] = "LEK"
        } else if (classType["pl"]=="Warsztat"){
            classType["pl"] = "WAR"
        }
        return classType;
    }

    // utworzenie tablicy z informacjami nt. rezerwacji, która jest wyświetlana w kalendarzu
    let roomActivities = activities?.map(activity => ({
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
        classtype_name: changeClasstypeName(activity.classtype_name),//activity.classtype_name,
        group_number: activity.group_number,
        lecturers: activity.lecturers,
        text: activity.start_time + activity.end_time + "\n" + activity.course_name + activity.classtype_name + "\n" + activity.group_number + activity.lecturers,
    } ));

    // wyświetlenie danych po najechaniu kursorem na event w kalendarzu
    const tooltipAccessor = (event: EventData) => {
        let lecturers_txt = '';

        Array.from(event.lecturers).map((lecturer, index) => {
            lecturers_txt = lecturers_txt.concat(lecturer.first_name.toString() + " " + lecturer.last_name.toString());
            if (Array.from(event.lecturers).length>1 && index<Array.from(event.lecturers).length-1){
                lecturers_txt = lecturers_txt.concat(", ");
            }
        })

        return `${event.classtype_name["pl"]}, gr.${event.group_number}\n${event.course_name["pl"]} - \n${lecturers_txt}`;
    }


    // const handleNavigate = (newDateRange: Date[], view: View) => {
    //     if (view === 'week' && newDateRange[0].getDate() > 7) {
    //         return myFunction();
    //     }
    // };



    // const [date, setDate] = useState(new Date(2015, 3, 1))
    // const onNavigate = useCallback((newDate) => {
    //     setDate(newDate);
    //     console.log("newdate: " + date);
    //     getRoomActivities();
    // }, [setDate])
    //
    // const onRangeChange = useCallback((range) => {
    //     console.log(range)
    //     // window.alert(buildMessage(range))
    // }, [])

    // const [currentDate, setCurrentDate] = useState<String>('');











    let currentDate = '2023-04-10';

    const handleNavigate = useCallback((newDateRange) => {
        const date = `${newDateRange.getFullYear()}-${newDateRange.getMonth()+1}-${newDateRange.getDate()-6}`
        console.log("start: " +  date );
        currentDate = date;
        // setCurrentDate(date);
        // getRoomActivities();

        // tutaj zaktualizowanie listy "activities"

        console.log(activities)

    }, []);





    return (
        <div className=" mx-16 py-10">
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
                    <div>
                        <div className="flex flex-col my-8">
                            <hr className="h-px my-8 bg-gray-200 border-0 h-0.5 dark:bg-gray-700"/>
                            <div>
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
                                    // timeslots={4}
                                    tooltipAccessor={tooltipAccessor}

                                    // defaultDate={defaultRange.start}
                                    // date={currentRange.length > 0 ? currentRange[0] : defaultRange.start}
                                    onNavigate={handleNavigate}

                                    // onNavigate={onNavigate}
                                    // onRangeChange={handleNavigate}
                                    dayLayoutAlgorithm="no-overlap"
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{height: 'full'}}
                                    min={new Date(0, 0, 0, 6, 0, 0)}
                                    max={new Date(0, 0, 0, 22, 0, 0)}
                                    messages={{
                                        allDay: 'Cały dzień',
                                        previous: 'Poprzedni',
                                        next: 'Następny',
                                        today: 'Dziś',
                                        day: 'Dzień',
                                        date: 'Data',
                                        time: 'Czas',
                                        event: 'Wydarzenie',
                                    }}
                                />
                            </div>
                            <div>
                                <p>tutaj dodanie rezerwacji</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function myFunction() {
    console.log('Next week button clicked!');
    return "";
}

export default Room;
