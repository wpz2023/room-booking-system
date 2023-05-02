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
    is_usos: boolean;
}

export interface EventData {
    start: Date;
    end: Date;
    course_name: Map<string, string>;
    classtype_name: Map<string, string>;
    group_number: number;
    lecturers: Set<Lecturer>;
    text: string;
    is_usos: boolean;
}