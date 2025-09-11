import { ColumnDef } from '@tanstack/react-table';
import { Road } from '@/src/app/protected/api/project/types/project';

const columns: ColumnDef<Road>[] = [
  {
    accessorKey: 'roadName',
    header: 'Road Name',
  },
  {
    accessorKey: 'section',
    header: 'Section',
  },
  {
    accessorKey: 'surface',
    header: 'Surface',
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
  },
  {
    accessorKey: 'length',
    header: 'Length (m)',
  },
  {
    accessorKey: 'width',
    header: 'Width (m)',
  },
  {
    accessorKey: 'area',
    header: 'Area (m²)',
  },
];

export { columns };
