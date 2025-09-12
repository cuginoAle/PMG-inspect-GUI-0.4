import { ColumnDef } from '@tanstack/react-table';
import type { ProjectItem } from '@/src/types';

const columns: ColumnDef<ProjectItem>[] = [
  {
    accessorKey: 'road_data.road_name',
    header: 'Road Name',
  },
  {
    accessorKey: 'road_data.road_section',
    header: 'Section',
  },
  {
    accessorKey: 'road_data.road_surface',
    header: 'Surface',
  },
  {
    accessorKey: 'road_data.road_lanes',
    header: 'Lanes',
  },
  {
    accessorKey: 'road_data.road_length',
    header: 'Length (m)',
  },
  {
    accessorKey: 'road_data.road_width',
    header: 'Width (m)',
  },
  {
    accessorKey: 'road_data.road_area',
    header: 'Area (m²)',
  },
  {
    accessorKey: 'road_data.road_functional_class',
    header: 'Functional Class',
  },
  {
    accessorKey: 'road_data.road_shoulder',
    header: 'Shoulder',
  },
];

export { columns };
