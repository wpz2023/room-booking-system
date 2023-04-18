import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import { useQuery } from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity, EventData} from "../models/Activity";
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NewCalendar from "./Calendar";


function Room() {
    const {id} = useParams();

    const[currentDate, setCurrendDate] = useState<String>('');

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

    const getRoomActivities = async () => {
        if (currentDate == ''){
            var todayDate = new Date()
            var date = `${todayDate.getFullYear()}-${todayDate.getMonth()+1}-${todayDate.getDate()-todayDate.getDay()+1}`
            return await Api.get(`activity/room/${id}/week?startTime=${date}`).then((res) => res.data);
        } else {
            return await Api.get(`activity/room/${id}/week?startTime=${currentDate}`).then((res) => res.data);
        }
    }

    // dane do zarządzania informacjami nt. rezerwacji danej sali
    let {
        data: activities,
        isFetching: isRoomActivitiesFetching,
        refetch: refetchActivities
    } = useQuery<Activity[]>(["activities", currentDate], getRoomActivities, {
        refetchOnWindowFocus: false,
        enabled: true
    });

    useEffect(() => {
        refetchRoom();
        refetchActivities();
    }, []);


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
    const [roomActivities, setRoomActivities] = useState<EventData[]>([])

    // dane do wyświetlenia po najechaniu kursorem na event w kalendarzu
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


    // do pobrania nowych rezerwacji po zmianie tygodnia w kalendarzu
    const handleNavigate = ((newDateRange: Date) => {
        const date = `${newDateRange.getFullYear()}-${newDateRange.getMonth()+1}-${newDateRange.getDate() - newDateRange.getDay()+1}`
        setCurrendDate(date)
    });

    useEffect ( () => {
        var test = activities?.map(activity => ({
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
            classtype_name: changeClasstypeName(activity.classtype_name),
            group_number: activity.group_number,
            lecturers: activity.lecturers,
            text: activity.start_time + activity.end_time + "\n" + activity.course_name + activity.classtype_name + "\n" + activity.group_number + activity.lecturers,
        } ));

        setRoomActivities(test)
    }, [activities]);


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
                                <NewCalendar activities={roomActivities} tooltipAccessor={tooltipAccessor}
                                             handleNavigate={handleNavigate} calendarDate={currentDate}/>
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

export default Room;
