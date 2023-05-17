import React, { useMemo } from 'react';
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

function ReservationsTable({data}: any) {
  
  const columns = [
        {
          accessorKey: 'id',
          header: 'ID',
          size: 80,
          Cell: ({ renderedCellValue, row }: {renderedCellValue: any, row: any}) => (
            <a href={`/rezerwacja/${row.id}`}>
              <span>{renderedCellValue}</span>
            </a>
          )
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
          accessorKey: 'status',
          header: 'Status',
          filterVariant: "select",
          filterSelectOptions: ["open", "accepted", "declined"],
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
    />
  );
};

export default ReservationsTable;
