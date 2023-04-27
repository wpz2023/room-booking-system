import React, {useEffect, useState} from "react";
import NewCalendar from "./Calendar";
import {EventPropGetter, Views} from "react-big-calendar";
import {EventData} from "../models/Activity";

const eventPropGetter: EventPropGetter<EventData> = (event: EventData) => {
    let backgroundColor = '#3174ad'

    if (!event.is_usos) {
        backgroundColor = '#0ea5e9'
    }

    return {style: {backgroundColor}}
}


function ConflictPopUp(
    {conflict, onClose, deleteActivities, roomName}
){

    const [activitiesToDelete, setActivitiesToDelete] = useState([])
    const year = Number(conflict.userActivity.start_time.substring(0,4))
    const month = Number(conflict.userActivity.start_time.substring(5,7))
    const day = Number(conflict.userActivity.start_time.substring(8,10))
    let minH = Number(conflict.userActivity.start_time.substring(11,13))
    let maxH = Number(conflict.userActivity.end_time.substring(11,13))

    useEffect(() => {
        if (activitiesToDelete.length > 0){
            onClose();
            deleteActivities(activitiesToDelete)
        }
    }, [activitiesToDelete])

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

    const conflictActivities = conflict.usosActivities.map(activity => ({
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
    }));

    conflictActivities.push({
        start: new Date(Number(conflict.userActivity.start_time.substring(0,4)), //year
            Number(conflict.userActivity.start_time.substring(5,7))-1, // month
            Number(conflict.userActivity.start_time.substring(8,10)), // day
            Number(conflict.userActivity.start_time.substring(11,13)), // hour
            Number(conflict.userActivity.start_time.substring(14,16)), // minute
        ),
        end: new Date(Number(conflict.userActivity.end_time.substring(0,4)), //year
            Number(conflict.userActivity.end_time.substring(5,7))-1, // month
            Number(conflict.userActivity.end_time.substring(8,10)), // day
            Number(conflict.userActivity.end_time.substring(11,13)), // hour
            Number(conflict.userActivity.end_time.substring(14,16)), // minute
        ),
        course_name: conflict.userActivity.course_name,
        classtype_name: changeClasstypeName(conflict.userActivity.classtype_name),
        group_number: conflict.userActivity.group_number,
        lecturers: conflict.userActivity.lecturers,
        text: conflict.userActivity.start_time + conflict.userActivity.end_time + "\n" + conflict.userActivity.course_name + conflict.userActivity.classtype_name + "\n" + conflict.userActivity.group_number + conflict.userActivity.lecturers,
        is_usos: conflict.userActivity.is_usos
    })

    conflict.usosActivities.map((activity) => {
        if ( Number(activity.start_time.substring(11,13)) < minH){
            minH = Number(activity.start_time.substring(11,13))
        }

        if ( Number(activity.end_time.substring(11,13)) > maxH){
            maxH = Number(activity.end_time.substring(11,13))
        }
    })

    const deleteUsosActivities = () => {
        const activities: string[] = []

        conflict.usosActivities.map((activity) => {
            activities.push(activity.id)
        })

        setActivitiesToDelete(activities)
    }

    const deleteUserActivity = () => {
        setActivitiesToDelete([conflict.userActivity.id])
    }

   return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="fixed inset-0 bg-gray-600 opacity-75"></div>
           <div className="bg-white rounded-lg p-6 z-50 w-[700px]">
               <div className="text-center my-3 text-2xl pb-3">
                   <p className="mb-1">Wykryto konflikty spotkań dla sali
                       <span className="font-bold"> {roomName} </span>
                   w dniu
                       <span className="font-bold"> {day}.{month}.{year}</span>
                   </p>
               </div>
               <div className=" items-center h-[500px] w-full">
                   <NewCalendar activities={conflictActivities} defaultView={Views.DAY} views={[Views.DAY]}
                                minDate={new Date(year, month, day, minH, 0, 0)}
                                maxDate={new Date(year, month, day, maxH, 0, 0)}
                                toolbar={false} date={new Date(conflict.userActivity.start_time.substring(0,10))}
                                step={30} eventPropGetter={eventPropGetter}/>
               </div>
               <div className="flex flex-row pt-7 pb-3">
                   <div className="basis-1/2 flex place-content-center">
                       <button onClick={deleteUsosActivities}
                           className="px-8 py-2 transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-700 hover:bg-sky-800 hover:shadow-sky-800 text-white shadow-lg shadow-sky-700">
                           Usuń rezerwacje USOS</button>
                   </div>
                   <div className="basis-1/2 flex place-content-center">
                       <button onClick={deleteUserActivity}
                           className="px-8 py-2 transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
                       Usuń rezerwacje użytkownika</button>
                   </div>
               </div>
           </div>
       </div>
   );
}

export default ConflictPopUp;