import { useQuery } from "@tanstack/react-query";
import { RoomData } from "../models/Room";
import Api from "../Api";
import { Link } from "react-router-dom";
import { useEffect, useState, ChangeEvent } from "react";
import DateTimePicker from 'react-datetime-picker';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function Rooms() {
  const token = sessionStorage.getItem("jwtToken");

  const [filterDate, setFilterDate] = useState(false);
  const [startDate, setStartDate] = useState<Value>(new Date());
  const [endDate, setEndDate] = useState<Value>(new Date());

  const [minCapacity, setMinCapacity] = useState(0);
  const [filterCapacity, setFilterCapacity] = useState(false);

  const [filterAnnotation, setFilterAnnotation] = useState(false);
  const [annotation, setAnnotation] = useState("");

  const onCapacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMinCapacity(value);
  }
  const handleFilter = ()=>{
    roomsQuery.refetch();
  }

  const DateTimePickerToString = (date: Value) =>{
    if(date === null) return "";

    const dateString = date.toLocaleDateString().split('.').reverse().join('-');
    const timeString = date.toLocaleTimeString();

    return `${dateString} ${timeString}`;
  }
  
  const roomsQuery = useQuery<RoomData[]>({
    queryKey: ["rooms"],
    queryFn: () => {
      const filterParams: any = {};
      if(filterCapacity) filterParams.capacityMin = minCapacity;
      if(filterDate){
        filterParams.startTime = DateTimePickerToString(startDate);
        filterParams.endTime = DateTimePickerToString(endDate);
      } 
      if(filterAnnotation) filterParams.annotation = annotation;

      return Api.Api.get("room", {params: filterParams})
        .then((res) => res.data)
    },
    enabled: true,
  });

  useEffect(() => {
    roomsQuery.refetch();
  }, [token]);

  roomsQuery.data?.forEach((room) => (room.type = "Sala dydaktyczna"));
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Lista sal</h1>
      {roomsQuery.isFetching ? (
        <div className="">Ładowanie...</div>
      ) : (
        <div>
          <div className="mb-2 p-3 bg-gray-200 rounded-lg flex-none flex-col">

            <div className="mb-1 flex flex-row p-1 bg-gray-300 rounded-md">
              <input className="m-2" checked={filterDate} type="checkbox" onChange={() => setFilterDate(!filterDate)}></input>
              <div>
                <div>
                  <label className="mr-2" htmlFor="startDate">Wolne od:</label>
                  <DateTimePicker id={"startDate"} disabled={!filterDate} value={startDate} onChange={setStartDate} />
                </div>
                <div>
                  <label className="mr-2" htmlFor="endDate">Wolne do:</label>
                  <DateTimePicker id={"endDate"}   disabled={!filterDate} value={endDate} onChange={setEndDate} />
                </div>
              </div>
            </div>
            
            <div className="mb-1 flex flex-row p-1 bg-gray-300 rounded-md">
              <input className="m-2" checked={filterCapacity} type="checkbox" onChange={() => setFilterCapacity(!filterCapacity)}></input>
              <div>
                <label className="mr-2" htmlFor="minCapacity">Minimalna pojemność:</label>
                <input className="w-12" id={"minCapacity"} disabled={!filterCapacity} type="number" value={minCapacity} onChange={onCapacityChange}></input>
              </div>
            </div>
           
            <div className="mb-1 flex flex-row p-1 bg-gray-300 rounded-md">
              <input className="m-2" id={"annotation"} checked={filterAnnotation} type="checkbox" onChange={() => setFilterAnnotation(!filterAnnotation)}></input>
              <div>
                <label className="mr-2" htmlFor="annotation">Rodzaj</label>
                <select value={annotation} disabled={!filterAnnotation} onChange={(event)=>{event.preventDefault();setAnnotation(event.target.value);}}>
                  <option value="">      Brak</option>
                  <option value="laboratoryjna">  Laboratoryjna</option>
                  <option value="wykładowa">      Wykładowa</option>
                  <option value="ćwiczeniowa">    Ćwiczeniowa</option>
                  <option value="komputerowa">    Komputerowa</option>
                </select>
              </div>
            </div>

            <button className="m-0 px-8 py-2 transition rounded-lg bg-amber-400 hover:bg-amber-500 
                             text-white shadow-md shadow-amber-600 hover:shadow-amber-700"
            onClick={handleFilter}>
            Filtruj
            </button>
          </div>


          <div className="grid grid-cols-3 gap-8">
            {roomsQuery.data?.map((room) => (
              <Link to={room.id.toString()} key={room.id}>
                <div className="bg-gray-200 rounded-lg shadow-lg p-6">
                  <h2 className="text-lg font-bold mb-4">{room.number}</h2>
                  <p className="text-sm mb-2">
                    <span className="font-bold">Rodzaj:</span> {room.roomAnnotation}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-bold">Pojemność:</span> {room.capacity}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
