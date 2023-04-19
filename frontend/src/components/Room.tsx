import React, {useEffect} from "react";
import {useParams} from "react-router";
import { useQuery } from "@tanstack/react-query";
import {RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NewCalendar from "./Calendar";


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
        enabled: true,
        
    });

    const getRoomActivities =  () => {
        return  Api.get(`activity/room/${id}`).then((res) => res.data);
    }

    // dane do zarządzania informacjami nt. rezerwacji danej sali
    let {
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

    // przechowuje eventy do wyświetlenia w kalendarzu
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
        classtype_name: changeClasstypeName(activity.classtype_name),
        group_number: activity.group_number,
        lecturers: activity.lecturers,
        text: activity.start_time + activity.end_time + "\n" + activity.course_name + activity.classtype_name + "\n" + activity.group_number + activity.lecturers,
    } ));


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
                            {room?.annotation}
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
                                <NewCalendar activities={roomActivities}/>
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
