import React from "react";
import {Conflict} from "../models/Conflict";

function ConflictPopUp(
    {conflict} : {conflict: Conflict},
    {onClose} : {onClose: () => void}
){

   return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="fixed inset-0 bg-gray-600 opacity-75"></div>
           <div className="bg-white rounded-lg p-3 z-50 w-[500px]">
               <p>Konflikty dla sali {conflict.userActivity.id}</p>
           </div>
       </div>
   );
}

export default ConflictPopUp;