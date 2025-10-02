import { createColumnHelper } from '@tanstack/react-table';
import type { ProjectItem, ProjectParsingState } from '@/src/types';
import { Flex, Progress, Text, TextProps } from '@radix-ui/themes';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { PciScoreBox, NeuralNetworkIcon } from '@/src/components';

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

const columnHelper = createColumnHelper<ProjectItem>();

const columnsDef = [
  columnHelper.display({
    id: 'select_all',
    cell: (info) => {
      return (
        <input
          id={info.row.original.video_url}
          name="selected"
          value={info.row.original.video_url}
          type="checkbox"
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
  }),
  columnHelper.accessor((row) => row.road_data.road_name, {
    id: 'road_name',
    header: 'Road Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data.road_surface, {
    id: 'road_surface',
    header: 'Surface',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data.road_lanes, {
    id: 'road_lanes',
    header: 'Lanes',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data.road_length, {
    id: 'road_length',
    header: 'Length (m)',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data.road_area, {
    id: 'road_area',
    header: 'Area (m²)',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data.road_functional_class, {
    id: 'road_functional_class',
    header: 'Functional Class',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row.pci_score_avg_human, {
    id: 'pci_score_avg_human',
    header: () => (
      <Flex justify="center" align={'center'} gap="1" width={'100%'}>
        <span>Pci</span>
        <PersonIcon />
      </Flex>
    ),
    cell: (info) => {
      const value = 10 + Math.random() * 90; // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1">
          <PciScoreBox value={Math.round(value)} />
        </Flex>
      );
    },
  }),

  //TODO: this should read "pci_score_avg_human_qc"
  columnHelper.accessor((row) => row.pci_score_avg_human, {
    id: 'pci_score_avg_human_qc',
    header: () => (
      <Flex justify="center" align={'center'} width={'100%'}>
        <span>Pci QC</span>
      </Flex>
    ),
    cell: (info) => {
      const value = 10 + Math.random() * 90; // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1">
          <PciScoreBox value={Math.round(value)} />
        </Flex>
      );
    },
  }),
  columnHelper.accessor((row) => row.pci_score_avg_ai, {
    id: 'pci_score_avg_ai',
    header: () => (
      <Flex align={'center'} gap="1">
        <span>Pci</span>
        <NeuralNetworkIcon size={1.6} />
      </Flex>
    ),
    cell: (info) => {
      const index = info.row.index;
      const color = index > 2 ? 'green' : index > 1 ? 'red' : 'yellow';
      const value = 10 + Math.random() * 90; // TODO: replace with actual value
      return (
        <Flex align="center" gap="1">
          <PciScoreBox value={Math.round(value)} />
          <Progress
            color={color}
            value={index > 2 ? 100 : 30 + Math.random() * 50} // TODO: replace with actual value
            size={'1'}
            radius="medium"
          />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.parsing_status, {
    id: 'parsing_status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as ProjectParsingState;
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
  }),
];

export { columnsDef };
