import React, {useEffect, useState} from "react";
import {Conflict} from "../models/Conflict";
import {tr} from "date-fns/locale";

function ConflictPopUp(
    {conflict} : {conflict: Conflict},
    {onClose}: {onClose: () => void},
    {popupVisible}: {popupVisible: boolean}
    // {onClick}: {onClick: () => void},
    // {roomName}: {roomName: string}
){

    if(!popupVisible){
        return null;
    }


    const [activitiesToDelete, setActivitiesToDelete] = useState([])

    const deleteUsosActivities = () => {
        const activities: String[] = []

        conflict.usosActivities.map((activity) => {
            activities.push(activity.id)
        })

        setActivitiesToDelete(activities)
    }

    const deleteUserActivity = () => {
        setActivitiesToDelete(conflict.userActivity.id)
    }

    useEffect(() => {
        console.log("to delete: " + activitiesToDelete)
        onClose();
    }, [activitiesToDelete])


   return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="fixed inset-0 bg-gray-600 opacity-75"></div>
           <div className="bg-white rounded-lg p-3 z-50 w-[700px]">
               <div className="text-center my-3">
                   <p>Wykryto konflikty spotkań dla sali</p>
               </div>
               <div className="flex flex-row items-center ">
                   <div className="basis-1/2 px-2 border-r border-gray-400">
                       <ul role="list" className="w-full divide-y divide-slate-200">
                           {conflict?.usosActivities.map((activity) => (
                               <li className="py-2" key={activity.id}>
                                   <p className="mb-1">
                                       <span className="font-bold">Rodzaj: </span>
                                       {activity.course_name["pl"]}
                                   </p>
                                   <p className="mb-1">
                                       <span className="font-bold">Od: </span>
                                       {activity.start_time}
                                   </p>
                                   <p className="mb-1">
                                       <span className="font-bold">Do: </span>
                                       {activity.end_time}
                                   </p>
                                   <p className="mb-1">
                                       <span className="font-bold">Prowadzący: </span>
                                       {Array.from(activity.lecturers).map((lecturer) => (
                                           <p className="pl-24">{lecturer.first_name} {lecturer.last_name}</p>))}
                                   </p>
                               </li>
                           ))}
                       </ul>
                   </div>


                   <div className="basis-1/2 px-2">
                       <p className="mb-1">
                           <span className="font-bold">Rodzaj: </span>
                           {conflict.userActivity.course_name["pl"]}
                       </p>
                       <p className="mb-1">
                           <span className="font-bold">Od: </span>
                           {conflict.userActivity.start_time}
                       </p>
                       <p className="mb-1">
                           <span className="font-bold">Do: </span>
                           {conflict.userActivity.end_time}
                       </p>
                       <p className="mb-1">
                           <span className="font-bold">Prowadzący: </span>
                           {Array.from(conflict.userActivity.lecturers).map((lecturer) => (
                               <p className="pl-24">{lecturer.first_name} {lecturer.last_name}</p>))}
                       </p>
                   </div>
               </div>
               <div className="flex flex-row pt-7 pb-3">
                   <div className="basis-1/2 flex place-content-center">
                       <button onClick={deleteUsosActivities}
                           className="px-8 py-2 transition hover:scale-110 delay-150 rounded-lg
                                    bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500">
                           Usuń rezerwacje Usos</button>
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