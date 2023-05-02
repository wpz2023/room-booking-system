import React, {useEffect, useState} from "react";
import NewCalendar from "./Calendar";
import {EventPropGetter, Views} from "react-big-calendar";
import {EventData} from "../models/Activity";
import {mapActivitiesToEvents} from "../utils/MapActivitiesToEvents";

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
    const conflictActivities = mapActivitiesToEvents(conflict.usosActivities)

    useEffect(() => {
        if (activitiesToDelete.length > 0){
            onClose();
            deleteActivities(activitiesToDelete)
        }
    }, [activitiesToDelete])

    conflictActivities.push(mapActivitiesToEvents([conflict.userActivity])[0])
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