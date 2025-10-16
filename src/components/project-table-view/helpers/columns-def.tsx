import { createColumnHelper } from '@tanstack/react-table';
import type { ProjectItem, ProjectParsingState } from '@/src/types';
import { Flex, Text, TextProps } from '@radix-ui/themes';
import {
  CheckCircledIcon,
  PersonIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import {
  NeuralNetworkIcon,
  DownloadIcon,
  VideoAnalysisProgress,
} from '@/src/components';

const parsingMap: Record<ProjectParsingState, React.ReactNode> = {
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

const dummyVideoStatuses: ProjectParsingState[] = [
  'download_error',
  'ready',
  'parsing',
  'parsing_error',
  'downloading',
];

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
        info.cell.row.index == 1
          ? undefined
          : Math.round(10 + Math.random() * 90); // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress pciScore={value} progress={100} />
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
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress pciScore={value} progress={100} />
        </Flex>
      );
    },
  }),
  columnHelper.accessor((row) => row.pci_score_avg_ai, {
    id: 'pci_score_avg_ai',
    header: () => (
      <Flex align={'center'} style={{ margin: 'auto' }} gap="1">
        <span>Pci</span>
        <NeuralNetworkIcon size={1.6} />
      </Flex>
    ),
    cell: (info) => {
      const value =
        info.cell.row.index === 1
          ? undefined
          : Math.round(10 + Math.random() * 90); // TODO: replace with actual value
      return (
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress
            pciScore={value}
            progress={info.cell.row.index === 2 ? 100 : value}
            hasErrors={info.cell.row.index === 0}
          />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.parsing_status, {
    id: 'parsing_status',
    header: () => <span style={{ margin: 'auto' }}>State</span>,
    cell: (info) => {
      // const status = info.getValue() as ProjectParsingState;

      // TODO: replace with the value above ⬆︎
      // const keys = Object.keys(parsingMap);
      // const status = keys[Math.round(Math.random() * 4)] as ProjectParsingState;
      const status =
        dummyVideoStatuses[info.row.index % dummyVideoStatuses.length];
      const color = statusColorsMap[status!];

      return (
        <Text
          as="p"
          align={'center'}
          color={color}
          title={statusTitleMap[status!]}
        >
          {parsingMap[status!]}
        </Text>
      );
    },
  }),
];

export { columnsDef };
