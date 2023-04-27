import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {RoomAnnotation, RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NewCalendar from "./Calendar";
import {Views} from "react-big-calendar";



function Room() {
    const {id} = useParams();
    const [roomAnnotation, setRoomAnnotation ] = useState()
    let token = window.sessionStorage.getItem("jwtToken");

    useEffect(() => {
        token = window.sessionStorage.getItem("jwtToken");
        refetchRoom()
    }, [token]);

    const getRoomInfo = () => {
        return Api.Api.get(`room/${id}`).then((res) => res.data);
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

    useEffect( () => {
        if (room?.roomAnnotation===null){
            setRoomAnnotation("")
        } else {
            setRoomAnnotation(room?.roomAnnotation)
        }
    }, [room])

    const getRoomActivities = () => {
        return  Api.Api.get(`activity/room/${id}`).then((res) => res.data);
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
        is_usos: activity.is_usos
    } ));

    const pushNewRoomAnnotation = useMutation((newAnnotation) => {
        const roomData = {
            "roomAnnotation": newAnnotation
        }

        return Api.authApi.patch(`room/update/${id}`,roomData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    })

    const roomAnnotationChange = (e) => {
        e.preventDefault();
        pushNewRoomAnnotation.mutate(RoomAnnotation[e.target.value as keyof typeof RoomAnnotation]) // e.target.value)
        setRoomAnnotation(e.target.value)
    }

    return (
        <div className=" mx-16 py-10">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold mb-4">Sala</h1>
                {isRoomFetching ? (
                    <p className="text-center">Ładowanie danych...</p>
                ) : (
                    <div className="w-60 text-start">
                        <p className="pb-4 text-4xl text-center font-bold">{room?.number}</p>

                        {!token ? (
                            <p className="mb-2 text-lg">
                                <span className="font-bold">Rodzaj: </span>
                                {room?.roomAnnotation}
                            </p>
                        ) : (
                            <div className="mb-2">
                                <label className=" text-lg font-bold">Rodzaj:
                                    <select value={Object.entries(RoomAnnotation).find(([key, val]) => val === roomAnnotation)?.[0]} onChange={roomAnnotationChange}
                                            className="ml-1  font-normal text-center px-1 border-b-2 border-blue-500
                                    hover:border-2 hover:border-blue-500 hover:rounded-md  focus:border-2
                                    focus:border-blue-500 focus:rounded-md outline-none ">
                                        {Object.keys(RoomAnnotation).map(key =>
                                            <option value={key}>{RoomAnnotation[key]}</option>
                                        )}
                                    </select>
                                </label>
                            </div>
                        )}

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
                                <NewCalendar activities={roomActivities} defaultView={Views.WEEK} views={[Views.WEEK]}
                                             minDate={new Date(0, 0, 0, 6, 0, 0)}
                                             maxDate={new Date(0, 0, 0, 22, 0, 0)}
                                             toolbar={true} step={15}/>
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
