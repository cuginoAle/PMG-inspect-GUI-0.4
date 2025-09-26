import { ColumnDef } from '@tanstack/react-table';
import type { ProjectItem, ProjectParsingState } from '@/src/types';
import { Text, TextProps } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

const parsingMap: Record<ProjectParsingState, React.ReactNode> = {
  download_done: 'Parsing',
  download_error: (
    <>
      <CrossCircledIcon width={16} height={16} />
      Download error
    </>
  ),
  download_timeout: (
    <>
      <CrossCircledIcon width={16} height={16} />
      Download timeout
    </>
  ),
  parsing_done: <CheckCircledIcon width={16} height={16} />,
  parsing_error: (
    <>
      <CrossCircledIcon width={16} height={16} />
      Parsing error
    </>
  ),
};

const columns: ColumnDef<ProjectItem>[] = [
  {
    accessorKey: 'road_data.road_name',
    header: 'Road Name',
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
    accessorKey: 'road_data.road_area',
    header: 'Area (m²)',
  },
  {
    accessorKey: 'road_data.road_functional_class',
    header: 'Functional Class',
  },
  {
    accessorKey: 'pci_score_avg_ai',
    header: 'PCI sc.',
    meta: 'ai',
  },
  {
    accessorKey: 'pci_score_avg_human',
    header: 'PCI sc.',
    meta: 'human',
  },

  {
    accessorKey: 'parsing_status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as ProjectParsingState;
      let color: TextProps['color'] = 'gray';

      if (status === 'parsing_done') {
        color = 'green';
      } else if (status === 'download_done') {
        color = 'blue';
      } else if (
        status === 'download_error' ||
        status === 'parsing_error' ||
        status === 'download_timeout'
      ) {
        color = 'red';
      }
      return (
        <Text as="p" align={'center'} color={color}>
          {parsingMap[status]}
        </Text>
      );
    },
  },
];

export { columns };
