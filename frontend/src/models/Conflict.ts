import {Activity} from "./Activity";

export interface Conflict {
    usosActivities: Activity[],
    userActivity: Activity
}