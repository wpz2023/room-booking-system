import { useQuery } from "@tanstack/react-query";
import { RoomData } from "../models/Room";
import Api from "../Api";

export function getRoomInfo(id: string | undefined, enabled = true) {
  const room = useQuery<RoomData>(
    ["room_info"],
    () => {
      return Api.Api.get(`room/${id}`).then((res) => res.data);
    },
    {
      refetchOnWindowFocus: false,
      enabled: enabled,
    }
  );

  return room;
}
