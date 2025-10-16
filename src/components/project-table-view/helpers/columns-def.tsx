import { createColumnHelper } from '@tanstack/react-table';
import type { ProjectItem } from '@/src/types';
import { Flex, Text } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { NeuralNetworkIcon, VideoAnalysisProgress } from '@/src/components';
import { parsingMap, statusColorsMap, statusTitleMap } from './constants';

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
  columnHelper.accessor((row) => row.road_data?.road_name, {
    id: 'road_name',
    header: 'Road Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data?.road_surface, {
    id: 'road_surface',
    header: 'Surface',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data?.road_lanes, {
    id: 'road_lanes',
    header: 'Lanes',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row.road_data?.road_length, {
    id: 'road_length',
    header: 'Length (m)',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.configuration, {
    // This should come from another endpoint
    id: 'configuration',
    header: 'Configuration',
    cell: (info) => {
      // TODO: replace with actual value
      return (
        <select>
          <option>dummy_Pci_01</option>
          <option>dummy_Pci_02</option>
          <option>dummy_Pci_03</option>
          <option>dummy_Pci_04</option>
        </select>
      );
      // info.getValue()
    },
  }),
  columnHelper.accessor((row) => row.road_data?.road_area, {
    id: 'road_area',
    header: 'Area (m²)',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.road_data?.road_functional_class, {
    id: 'road_functional_class',
    header: 'Functional Class',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row.avg_pci_score_human_inspector, {
    id: 'avg_pci_score_human_inspector',
    header: () => (
      <Flex justify="center" align={'center'} gap="1" width={'100%'}>
        <span>Pci</span>
        <PersonIcon />
      </Flex>
    ),
    cell: (info) => {
      return (
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress pciScore={info.getValue()} progress={100} />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.avg_pci_score_human_qg, {
    id: 'avg_pci_score_human_qg',
    header: () => <span style={{ margin: 'auto' }}>Pci QC</span>,
    cell: (info) => {
      return (
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress pciScore={info.getValue()} progress={100} />
        </Flex>
      );
    },
  }),
  columnHelper.accessor((row) => row.pci_score_avg_ai, {
    // TODO: this data should come from another endpoint
    id: 'pci_score_avg_ai',
    header: () => (
      <Flex align={'center'} style={{ margin: 'auto' }} gap="1">
        <span>Pci</span>
        <NeuralNetworkIcon size={1.6} />
      </Flex>
    ),
    cell: (info) => {
      return (
        <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
          <VideoAnalysisProgress
            pciScore={info.getValue()}
            progress={undefined}
          />
        </Flex>
      );
    },
  }),

  columnHelper.accessor((row) => row.video_status, {
    id: 'video_status',
    header: () => <span style={{ margin: 'auto' }}>State</span>,
    cell: (info) => {
      const status = info.getValue();
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
