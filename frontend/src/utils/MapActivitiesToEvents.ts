import { changeClasstypeName } from "./ChangeClassType";
import { Activity } from "../models/Activity";
import { parseDateFromDB } from "./ParseDate";

export function mapActivitiesToEvents(activities: Activity[]) {
  return activities?.map((activity) => ({
    ...activity,
    start: new Date(parseDateFromDB(activity.start_time)),
    end: new Date(parseDateFromDB(activity.end_time)),
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
