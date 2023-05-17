import MaterialReactTable from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';


function ReservationsTable({data}: any) {
  
  const columns = [
        {
          header: '',
          id: 'Details',
          size: 120,
          Cell: ({ renderedCellValue, row }: {renderedCellValue: any, row: any}) => (
            <a href={`/rezerwacja/${row.id}`} className="bg-gray-300 p-0.5 rounded-md transition hover:bg-gray-400 hover:scale-120" >
              <span>Szczegóły</span>
            </a>
          )
        },
        {
          accessorKey: 'name',
          header: 'Tytuł',
        },
        {
          accessorFn: (row: any) => `${row.first_name} ${row.last_name}`,
          header: 'Prowadzący',
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'start_time',
          header: 'Czas Rozpoczęcia',
        },
        {
          accessorKey: 'end_time',
          header: 'Czas Zakończenia',
        },
        {
          accessorFn: (row: any) =>{
            const val = row.status;
            switch(val){ 
              case "open": return "Otwarta";
              case "accepted": return "Zaakceptowana";
              case "declined": return "Odrzucona";
            }
          },
          accessorKey: 'status',
          header: 'Status',
          filterVariant: "select",
          filterSelectOptions: ["Otwarta", "Zaakceptowana", "Odrzucona"],
          size: 120
        }
  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilters
      enableColumnResizing 
      enableFilters
      localization={MRT_Localization_PL}
    />
  );
};

export default ReservationsTable;
