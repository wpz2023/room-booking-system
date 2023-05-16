import { changeClasstypeName } from "./ChangeClassType";
import { Activity } from "../models/Activity";

export function mapActivitiesToEvents(activities: Activity[]) {
  return activities?.map((activity) => ({
    ...activity,
    start: new Date(
      Number(activity.start_time.substring(0, 4)), //year
      Number(activity.start_time.substring(5, 7)) - 1, // month
      Number(activity.start_time.substring(8, 10)), // day
      Number(activity.start_time.substring(11, 13)), // hour
      Number(activity.start_time.substring(14, 16)) // minute
    ),
    end: new Date(
      Number(activity.end_time.substring(0, 4)), //year
      Number(activity.end_time.substring(5, 7)) - 1, // month
      Number(activity.end_time.substring(8, 10)), // day
      Number(activity.end_time.substring(11, 13)), // hour
      Number(activity.end_time.substring(14, 16)) // minute
    ),
    course_name: activity.course_name,
    classtype_name: changeClasstypeName(
      new Map(Object.entries(activity.classtype_name))
    ),
    group_number: activity.group_number,
    lecturers: activity.lecturers,
    text:
      activity.start_time +
      activity.end_time +
      "\n" +
      activity.course_name +
      activity.classtype_name +
      "\n" +
      activity.group_number +
      activity.lecturers,
    is_usos: activity.is_usos,
  }));
}
