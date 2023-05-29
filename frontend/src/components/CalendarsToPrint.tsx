import React, {useRef} from "react";
import {countDaysLeftInWeek} from "../utils/CountDaysLeftInWeek";
import {Views} from "react-big-calendar";
import NewCalendar from "./Calendar";
import CustomWeekView from "../utils/CustomWeekView";
import ReactToPrint from "react-to-print";
import "./styles/CalendarsToPrint.css"
import {EventData} from "../models/Activity";

function CalendarsToPrint({
                              rangeStart,
                              rangeEnd,
                              cbxDeleteDatesChecked,
                              cbxSelectDateChecked,
                              roomNumber,
                              roomActivities,
                              backgroundEvent,
                              handleSelectSlot,
                              onAfterPrint
                          }: {
    rangeStart: Date,
    rangeEnd: Date,
    cbxDeleteDatesChecked: boolean,
    cbxSelectDateChecked: boolean,
    roomNumber?: number,
    roomActivities: EventData[],
    backgroundEvent: any,
    handleSelectSlot: any,
    onAfterPrint: () => void
}) {
    const CalendarsToPrintForwardRef = React.forwardRef((props: any, ref) => {
        let startDate: Date = rangeStart;
        let endDate: Date = rangeEnd;
        const datesSelected = cbxSelectDateChecked && startDate != null && endDate != null;
        const oneWeekTime = 1000 * 60 * 60 * 24 * 7;
        let calendarsCount = 1;
        let startDay = startDate.getDay();
        let endDay = endDate.getDay();
        let calendars = [];

        const formats: any = {}
        if (cbxDeleteDatesChecked) {
            formats.dayFormat = (date, culture, localizer) => localizer.format(date, 'EEE', culture);
            formats.dayRangeHeaderFormat = ({start, end}, culture, localizer) => localizer.format(start, ' ', culture);
        }

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

        for (let i = 0; i < calendarsCount; i++) {
            let calendarStartDate = new Date(0, 0, 0, 6, 0, 0);
            let calendarEndDate = new Date(0, 0, 0, 22, 0, 0);
            let countOfDays = 7;
            let shouldHideDateHeader = false;
            let defaultView: string = Views.WEEK;
            let defaultDate: Date | undefined = undefined;

            if (datesSelected) {
                if (i === 0) {
                    calendarStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 6, 0, 0);
                }
                if (i === calendarsCount - 1) {
                    calendarEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 22, 0, 0);
                }
                countOfDays = countDaysLeftInWeek(calendarStartDate, calendarEndDate);
            }

            if (countOfDays <= 6) {
                defaultView = 'customWeekView';
                shouldHideDateHeader = true;
            }

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
                    Sala: {roomNumber}
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
                   .rbc-event, .rbc-event.rbc-selected, .rbc-day-slot .rbc-selected.rbc-background-event { color: black; background-color: white; }\
                  }"
                }
            </style>
            <div>
                {calendars}
            </div>
        </div>);
    });

    const calendarRef = useRef();

    return <div><CalendarsToPrintForwardRef ref={calendarRef}/>
        <ReactToPrint
            trigger={() => <div style={{marginTop: "15px", display: "flex", justifyContent: "center"}}>
                <button
                    className="hover:shadow-form rounded-md bg-sky-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                    Wydrukuj plan
                </button>
            </div>}
            content={() => calendarRef.current}
            onAfterPrint={onAfterPrint}
        /></div>
}

export default CalendarsToPrint;