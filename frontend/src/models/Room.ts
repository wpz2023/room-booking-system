export interface Room{
    id: number;
    number: number;
}

export interface RoomData extends Room{
    type: string;
    capacity: number;
}