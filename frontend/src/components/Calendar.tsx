import {Calendar, dateFnsLocalizer, Views} from "react-big-calendar";
import React, {useEffect, useRef} from "react";
import {pl} from "date-fns/locale";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import {Lecturer} from "../models/Lecturer";


interface EventProps {
    event: EventData;
    children?: React.ReactNode;
}

interface EventData {
    start: Date;
    end: Date;
    course_name: Map<string, string>;
    classtype_name: Map<string, string>;
    group_number: number;
    lecturers: Set<Lecturer>;
    text: string;
}


const Event: React.FC<EventProps> = ({ event, children }) => {
    const eventRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (eventRef.current) {
            const eventElement = eventRef.current;
            const eventHeight = eventElement.offsetHeight;
            const eventWidth = eventElement.offsetWidth;
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


function NewCalendar(
    {activities}: { activities: EventData[]}
) {

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


    return (
        <Calendar
            culture={"pl"}
            localizer={localizer}
            events={activities}
            defaultView={Views.WEEK}
            views={[Views.WEEK]}
            components={{
                event: Event
            }}
            step={15}
            tooltipAccessor={tooltipAccessor}
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
    )
}

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

export default NewCalendar;