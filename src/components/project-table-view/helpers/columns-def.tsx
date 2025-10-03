import { createColumnHelper } from '@tanstack/react-table';
import type { ProjectItem, ProjectParsingState } from '@/src/types';
import { Flex, Progress, Text, TextProps } from '@radix-ui/themes';
import {
  CheckCircledIcon,
  PersonIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import { PciScoreBox, NeuralNetworkIcon, DownloadIcon } from '@/src/components';

const parsingMap: Record<ProjectParsingState, React.ReactNode> = {
  // downloading: <DownloadIcon width={18} height={18} className="blinking" />,
  downloading: <DownloadIcon size={1.8} className="downloading" />,
  parsing: <UpdateIcon width={18} height={18} className="spinning" />,
  ready: <CheckCircledIcon width={18} height={18} />,
  download_error: <DownloadIcon size={1.8} />,
  parsing_error: <UpdateIcon width={18} height={18} />,
};

const statusColorsMap: Record<ProjectParsingState, TextProps['color']> = {
  download_error: 'red',
  downloading: 'blue',
  parsing: 'blue',
  parsing_error: 'red',
  ready: 'green',
};

const statusTitleMap: Record<ProjectParsingState, string> = {
  download_error: 'Download error',
  downloading: 'Dowloading...',
  parsing: 'Parsing...',
  parsing_error: 'Parsing error',
  ready: 'Ready',
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

  columnHelper.accessor((row) => row.pci_score_avg_human_inspector, {
    id: 'pci_score_avg_human',
    header: () => (
      <Flex justify="center" align={'center'} gap="1" width={'100%'}>
        <span>Pci</span>
        <PersonIcon />
      </Flex>
    ),
    cell: (info) => {
      const value =
        info.cell.row.index === 1
          ? undefined
          : Math.round(10 + Math.random() * 90); // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1">
          <PciScoreBox value={value} />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.pci_score_avg_human_qc, {
    id: 'pci_score_avg_human_qc',
    header: () => <span style={{ margin: 'auto' }}>Pci QC</span>,
    cell: (info) => {
      const value =
        info.cell.row.index === 1
          ? undefined
          : Math.round(10 + Math.random() * 90); // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1">
          <PciScoreBox value={value} />
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
      const value =
        info.cell.row.index === 1
          ? undefined
          : Math.round(10 + Math.random() * 90); // TODO: replace with actual value
      return (
        <Flex align="center" gap="1">
          <PciScoreBox value={value} />
          <Progress
            color={color}
            value={index > 2 ? 100 : value ? 30 + Math.random() * 50 : 0} // TODO: replace with actual value
            size={'1'}
            radius="medium"
          />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.parsing_status, {
    id: 'parsing_status',
    header: () => <span style={{ margin: 'auto' }}>Status</span>,
    cell: (info) => {
      // const status = info.getValue() as ProjectParsingState;

      // TODO: replace with the value above ⬆︎
      const keys = Object.keys(parsingMap);
      const status = keys[Math.round(Math.random() * 4)] as ProjectParsingState;

      const color = statusColorsMap[status];

      return (
        <Text
          as="p"
          align={'center'}
          color={color}
          title={statusTitleMap[status]}
        >
          {parsingMap[status]}
        </Text>
      );
    },
  }),
];

export { columnsDef };
