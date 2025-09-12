import { ColumnDef } from '@tanstack/react-table';
import type { RoadData } from '@/src/types';

const columns: ColumnDef<RoadData>[] = [
  {
    accessorKey: 'road_name',
    header: 'Road Name',
  },
  {
    accessorKey: 'road_section',
    header: 'Section',
  },
  {
    accessorKey: 'road_surface',
    header: 'Surface',
  },
  {
    accessorKey: 'road_lanes',
    header: 'Lanes',
  },
  {
    accessorKey: 'road_length',
    header: 'Length (m)',
  },
  {
    accessorKey: 'road_width',
    header: 'Width (m)',
  },
  {
    accessorKey: 'road_area',
    header: 'Area (m²)',
  },
  {
    accessorKey: 'road_functional_class',
    header: 'Functional Class',
  },
  {
    accessorKey: 'road_shoulder',
    header: 'Shoulder',
  },
];

export { columns };
