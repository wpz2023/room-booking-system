import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {RoomAnnotation} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {mapActivitiesToEvents} from "../utils/MapActivitiesToEvents";
import Calendar from 'react-calendar';
import {getRoomInfo} from "../utils/GetRoomInfo";
import CalendarsToPrint from "../components/CalendarsToPrint";
import ReservationForm from "../components/ReservationForm";
import {BackgroundEvent} from "../components/Calendar";

function Room() {
    const {id} = useParams();
    const [roomAnnotation, setRoomAnnotation] = useState<String | undefined>();
    const [backgroundEvent, setBackgroundEvent] = useState<BackgroundEvent>();
    const [cbxDeleteDatesChecked, setCbxDeleteDatesChecked] = React.useState(false);
    const [cbxSelectDateChecked, setCbxSelectDateChecked] = React.useState(false);
    const [smallCalendarValues, setSmallCalendarValues] = useState([undefined, undefined]);

    let token = window.sessionStorage.getItem("jwtToken");

    useEffect(() => {
        refetchRoom();
        refetchActivities();
    }, []);

    useEffect(() => {
        token = window.sessionStorage.getItem("jwtToken");
        refetchRoom();
    }, [token]);

    const {
        data: room,
        isFetching: isRoomFetching,
        refetch: refetchRoom,
    } = getRoomInfo(id);

    useEffect(() => {
        if (room?.roomAnnotation === null) {
            setRoomAnnotation("");
        } else {
            setRoomAnnotation(room?.roomAnnotation);
        }
    }, [room]);

    const getRoomActivities = () => {
        return Api.Api.get(`activity/room/${id}`).then((res) => res.data);
    };

    let {
        data: activities,
        isFetching: isRoomActivitiesFetching,
        refetch: refetchActivities,
    } = useQuery<Activity[]>(["activities"], getRoomActivities, {
        refetchOnWindowFocus: false,
        enabled: true,
    });

    const roomActivities = mapActivitiesToEvents(activities as Activity[]);

    const pushNewRoomAnnotation = useMutation((newAnnotation) => {
        const roomData = {
            roomAnnotation: newAnnotation,
        };

        return Api.authApi.patch(`room/update/${id}`, roomData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    });

    const roomAnnotationChange = (e) => {
        e.preventDefault();
        pushNewRoomAnnotation.mutate(RoomAnnotation[e.target.value as keyof typeof RoomAnnotation]); // e.target.value)
        setRoomAnnotation(e.target.value);
    };

    const handleSelectSlot = ({start, end}: { start: Date; end: Date }) => {
        setBackgroundEvent({
            start: start, end: end, course_name: {pl: "REZERWACJA"}, id: 0,
        });
    };

    const cbxDeleteDatesChanged = () => {
        setCbxDeleteDatesChecked(!cbxDeleteDatesChecked);
    };

    const cbxSelectDateChanged = () => {
        setCbxSelectDateChecked(!cbxSelectDateChecked);
    };

    const smallCalendarChanged = (value: React.SetStateAction<Date[]>, _: any) => {
        setSmallCalendarValues(value);
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        })
    }

    const Checkbox = ({label, value, onChange}) => {
        return (<label>
            <input type="checkbox" checked={value} onChange={onChange}/>
            {label}
        </label>);
    };

    return (<div className=" mx-16 py-10">
        <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-4">Sala</h1>
            {isRoomFetching ? (<p className="text-center">Ładowanie danych...</p>) : (<div className="w-60 text-start">
                <p className="pb-4 text-4xl text-center font-bold">
                    {room?.number}
                </p>

                {!token ? (<p className="mb-2 text-lg">
                    <span className="font-bold">Rodzaj: </span>
                    {room?.roomAnnotation}
                </p>) : (<div className="mb-2">
                    <label className=" text-lg font-bold">
                        Rodzaj:
                        <select
                            value={Object.entries(RoomAnnotation).find(([key, val]) => val === roomAnnotation)?.[0]}
                            onChange={roomAnnotationChange}
                            className="ml-1  font-normal text-center px-1 border-b-2 border-blue-500
                                    hover:border-2 hover:border-blue-500 hover:rounded-md  focus:border-2
                                    focus:border-blue-500 focus:rounded-md outline-none "
                        >
                            {Object.keys(RoomAnnotation).map((key) => (
                                <option value={key}>{RoomAnnotation[key]}</option>))}
                        </select>
                    </label>
                </div>)}

                <p className="mb-2 text-lg">
                    <span className="font-bold">Pojemność: </span>
                    {room?.capacity}
                </p>
            </div>)}
        </div>

        <div>
            {isRoomActivitiesFetching ? (<div className="mt-8 text-center">Ładowanie danych...</div>) : (<div>
                <div className="flex flex-col my-8">
                    <hr className="h-px bg-gray-200 border-0 h-0.5 dark:bg-gray-700"/>
                    <div>
                        <CalendarsToPrint
                            roomNumber={room?.number}
                            roomActivities={roomActivities}
                            cbxDeleteDatesChecked={cbxDeleteDatesChecked}
                            cbxSelectDateChecked={cbxSelectDateChecked}
                            rangeStart={smallCalendarValues[0]}
                            rangeEnd={smallCalendarValues[1]}
                            backgroundEvent={backgroundEvent}
                            handleSelectSlot={handleSelectSlot}
                            onAfterPrint={() => {
                                setCbxSelectDateChecked(false);
                                window.scrollTo(0, 0);
                            }}/>
                        <div style={{marginTop: "15px", display: "flex", justifyContent: "center"}}>
                            <Checkbox
                                label="Usuń nagłówki dat"
                                value={cbxDeleteDatesChecked}
                                onChange={cbxDeleteDatesChanged}
                            />
                            <a style={{paddingLeft: "10px", paddingRight: "10px"}}></a>
                            <Checkbox
                                label="Wybierz przedział dat"
                                value={cbxSelectDateChecked}
                                onChange={cbxSelectDateChanged}
                            />
                        </div>
                        {cbxSelectDateChecked ? (
                            <div style={{marginTop: "15px", display: "flex", justifyContent: "center"}}>
                                <Calendar
                                    onChange={smallCalendarChanged}
                                    value={smallCalendarValues}
                                    selectRange={true}
                                />
                            </div>) : null}
                    </div>
                    {!cbxSelectDateChecked ? (<div>
                        <ReservationForm roomId={id} event={backgroundEvent}/>
                    </div>) : null}
                </div>
            </div>)}
        </div>
    </div>);
}

export default Room;
