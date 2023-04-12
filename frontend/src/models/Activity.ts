import {Lecturer} from "./Lecturer";

export interface Activity{
    id: string;
    type: string;
    start_time: string;
    end_time: string;
    url: string;
    course_name: Map<string, string>;
    classtype_name: Map<string, string>;
    group_number: number;
    room_id: number;
    lecturers: Set<Lecturer>;
}