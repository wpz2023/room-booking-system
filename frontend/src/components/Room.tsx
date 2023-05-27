import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {RoomAnnotation, RoomData} from "../models/Room";
import Api from "../Api";
import {Activity} from "../models/Activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NewCalendar, {BackgroundEvent} from "./Calendar";
import {Views} from "react-big-calendar";
import {mapActivitiesToEvents} from "../utils/MapActivitiesToEvents";
import ReservationForm from "./ReservationForm";
import ReactToPrint from "react-to-print";
import "./styles/Room.css"
import Calendar from 'react-calendar';
import CustomWeekView from "../utils/CustomWeekView";
import {countDaysLeftInWeek} from "../utils/CountDaysLeftInWeek";

function Room() {
    const {id} = useParams();
    const [roomAnnotation, setRoomAnnotation] = useState<String | undefined>();
    const [backgroundEvent, setBackgroundEvent] = useState<BackgroundEvent>();

    let token = window.sessionStorage.getItem("jwtToken");

    useEffect(() => {
        refetchRoom();
        refetchActivities();
    }, []);

    useEffect(() => {
        token = window.sessionStorage.getItem("jwtToken");
        refetchRoom();
    }, [token]);

    const getRoomInfo = () => {
        return Api.Api.get(`room/${id}`).then((res) => res.data);
    };

    // zmienne do zarządzania informacjami nt. sali
    const {
        data: room, isFetching: isRoomFetching, refetch: refetchRoom,
    } = useQuery<RoomData>(["room_info"], getRoomInfo, {
        refetchOnWindowFocus: false, enabled: true,
    });

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

    // dane do zarządzania informacjami nt. rezerwacji danej sali
    let {
        data: activities, isFetching: isRoomActivitiesFetching, refetch: refetchActivities,
    } = useQuery<Activity[]>(["activities"], getRoomActivities, {
        refetchOnWindowFocus: false, enabled: true,
    });

    // przechowuje eventy do wyświetlenia w kalendarzu
    const roomActivities = mapActivitiesToEvents(activities);

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

    const [cbxDeleteRangeChecked, setCbxDeleteRangeChecked] = React.useState(false);
    const cbxDeleteRangeChanged = () => {
        setCbxDeleteRangeChecked(!cbxDeleteRangeChecked);
    };

    const [cbxDeleteDateChecked, setCbxDeleteDateChecked] = React.useState(false);
    const cbxDeleteDateChanged = () => {
        setCbxDeleteDateChecked(!cbxDeleteDateChecked);
    };

    const [cbxSelectDateChecked, setCbxSelectDateChecked] = React.useState(false);
    const cbxSelectDateChanged = () => {
        setCbxSelectDateChecked(!cbxSelectDateChecked);
    };

    const [smallCalendarValues, setSmallCalendarValues] = useState([new Date(), new Date()]);
    const smallCalendarChanged = (value: React.SetStateAction<Date[]>, _: any) => {
        setSmallCalendarValues(value);
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        })
    }

    const calendarRef = useRef();

    const CalendarToPrint = React.forwardRef((props: any, ref) => {
        let startDate: Date = smallCalendarValues[0];
        let endDate: Date = smallCalendarValues[1];

        const datesSelected = cbxSelectDateChecked && startDate != null && endDate != null;
        const oneWeekTime = 1000 * 60 * 60 * 24 * 7;
        let calendarsCount = 1;
        let startDay = startDate.getDay();
        let endDay = endDate.getDay();

        if (datesSelected) {
            calendarsCount = Math.ceil((endDate.getTime() - startDate.getTime()) / oneWeekTime);

            if (startDay === 0) {
                startDay = 7;
            }
            if (endDay === 0) {
                endDay = 7;
            }
            if (startDay > endDay) {
                calendarsCount++;
            }
        }

        const formats: any = {}
        if (cbxDeleteDateChecked) {
            formats.dayFormat = (date, culture, localizer) => localizer.format(date, 'EEE', culture);
        }
        if (cbxDeleteRangeChecked) {
            formats.dayRangeHeaderFormat = ({start, end}, culture, localizer) => localizer.format(start, ' ', culture);
        }

        let calendars = [];
        for (let i = 0; i < calendarsCount; i++) {
            let calendarStartDate = new Date(0, 0, 0, 6, 0, 0);
            let calendarEndDate = new Date(0, 0, 0, 22, 0, 0);
            let countOfDays = 7;
            if (datesSelected) {
                if (i === 0) {
                    calendarStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 6, 0, 0);
                }
                if (i === calendarsCount - 1) {
                    calendarEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 22, 0, 0);
                }
                countOfDays = countDaysLeftInWeek(calendarStartDate, calendarEndDate);
            }

            let shouldHideDateHeader = false;
            let defaultView: string = Views.WEEK;
            if (countOfDays <= 6) {
                defaultView = 'customWeekView';
                shouldHideDateHeader = true;
            }

            let defaultDate: Date | undefined = undefined;
            if (datesSelected) {
                if (i === calendarsCount - 1) {
                    if (calendarsCount === 1) {
                        defaultDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
                    } else {
                        defaultDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - endDay + 1)
                    }
                } else {
                    defaultDate = new Date(startDate.getTime() + oneWeekTime * i);
                }
            }

            calendars.push(<div className={datesSelected ? "hide-navigation" : ""}
                                style={{breakInside: "avoid", pageBreakInside: "avoid"}}>
                <p id={"classNumberToPrint"} className="text-4xl text-center font-bold"
                   style={{visibility: "hidden"}}>
                    Sala: {room?.number}
                </p>
                <NewCalendar
                    activities={roomActivities}
                    defaultView={defaultView}
                    views={datesSelected ? {
                        customWeekView: CustomWeekView, week: true, day: true
                    } : {week: true}}
                    countOfDays={countOfDays}
                    minDate={calendarStartDate}
                    maxDate={calendarEndDate}
                    toolbar={!shouldHideDateHeader}
                    step={15}
                    backgroundEvent={backgroundEvent}
                    handleSelectSlot={handleSelectSlot}
                    selectable={!datesSelected}
                    defaultDate={defaultDate}
                    formats={formats}
                />
            </div>);
        }

        return (<div ref={ref}>
            <style type="text/css" media="print">
                {"@media print \
                {\
                   @page { size: A3 landscape; }\
                   #classNumberToPrint { visibility: visible !important; }\
                   .rbc-btn-group { display: none !important; }\
                   .rbc-today { background-color: transparent; }\
                   .rbc-current-time-indicator { display: none !important; }\
                   .rbc-day-slot .rbc-background-event { display: none !important; }\
                   .rbc-timeslot-group { min-height: 30px; }\
                   .rbc-event, .rbc-event.rbc-selected, .rbc-day-slot .rbc-selected.rbc-background-event { color: black; background-color: white; }"
                    + (cbxDeleteRangeChecked ? ".rbc-toolbar { display: none !important; }}" : "") + "\ }"}
            </style>
            <div>
                {calendars}
            </div>
        </div>);
    });

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
                        <CalendarToPrint ref={calendarRef}/>
                        <ReactToPrint
                            trigger={() => <div className="center-with-margin">
                                <button
                                    className="hover:shadow-form rounded-md bg-sky-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                                    Wydrukuj plan
                                </button>
                            </div>}
                            content={() => calendarRef.current}
                            onAfterPrint={() => {
                                setCbxSelectDateChecked(false);
                                window.scrollTo(0, 0);
                            }}
                        />
                        <div className="center-with-margin">
                            <Checkbox
                                label="Usuń nagłówki dat"
                                value={cbxDeleteDateChecked}
                                onChange={cbxDeleteDateChanged}
                            />
                            <a style={{paddingLeft: "10px", paddingRight: "10px"}}></a>
                            <Checkbox
                                label="Usuń przedział dat"
                                value={cbxDeleteRangeChecked}
                                onChange={cbxDeleteRangeChanged}
                            />
                            <a style={{paddingLeft: "10px", paddingRight: "10px"}}></a>
                            <Checkbox
                                label="Wybierz przedział dat"
                                value={cbxSelectDateChecked}
                                onChange={cbxSelectDateChanged}
                            />
                        </div>
                        {cbxSelectDateChecked ? (<div className="center-with-margin">
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
