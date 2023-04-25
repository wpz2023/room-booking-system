export interface Room{
    id: number;
    number: number;
}

export interface RoomData extends Room{
    type: string;
    capacity: number;
    roomAnnotation: RoomAnnotation;
}

export enum RoomAnnotation {
    LAB = "laboratoryjna",
    LECTURE = "wykładowa",
    EXERCISE = "ćwiczeniowa",
    COMPUTER = "komputerowa",
    EMPTY = ""
}