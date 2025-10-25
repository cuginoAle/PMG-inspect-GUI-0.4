import { createColumnHelper } from '@tanstack/react-table';
import type {
  AugmentedProjectItemData,
  ProcessingConfiguration,
} from '@/src/types';
import { Flex, Text } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import {
  NeuralNetworkIcon,
  VideoAnalysisProgress,
  VideoAnalysisScoreGauge,
} from '@/src/components';
import { parsingMap, statusColorsMap, statusTitleMap } from './constants';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<AugmentedProjectItemData>();

const useColumnsDef = ({
  processingConfiguration,
  checkedRowIds,
}: {
  processingConfiguration: ProcessingConfiguration[];
  checkedRowIds: string[];
}) => {
  return useMemo(
    () => [
      columnHelper.display({
        id: 'select_all',
        cell: (info) => {
          return (
            <input
              id={info.row.original.video_url}
              name="selectedRowCheckbox"
              value={info.row.original.video_url}
              type="checkbox"
              data-component-id="row-select-checkbox"
              onChange={() => void 0}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              defaultChecked={checkedRowIds?.includes(
                info.row.original.video_url,
              )}
            />
          );
        },
      }),
      columnHelper.accessor((row) => `${row.video_name}`, {
        id: 'road_name',
        header: 'Road Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.road_data?.road_surface, {
        id: 'road_surface',
        header: 'Surface',
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor((row) => row.road_data?.road_length, {
        id: 'road_length',
        header: 'Length (m)',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.selected_configuration, {
        id: 'configurations',
        header: 'Configurations',
        cell: (info) => {
          return (
            <div
              // Prevent row selection on interacting with the select dropdown
              // I had to put this on a div wrapping the select because putting it directly on the select
              // did not work
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <select
                data-video-id={info.row.original.video_url}
                data-component-id="configuration-select"
                onChange={() => void 0}
                onDoubleClick={(e) => e.stopPropagation()}
                disabled={
                  checkedRowIds.length > 0 &&
                  !checkedRowIds?.includes(info.row.original.video_url)
                }
                value={
                  info.row.original.selected_configuration ||
                  processingConfiguration[0]?.processing_configuration_name
                }
              >
                {processingConfiguration.map((config) => (
                  <option
                    value={config.processing_configuration_name}
                    key={config.processing_configuration_name}
                  >
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.road_data?.road_area, {
        id: 'road_area',
        header: 'Area (m²)',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.road_data?.road_functional_class, {
        id: 'road_functional_class',
        header: 'Fun. Class',
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor((row) => row.road_data?.inspector_pci, {
        id: 'inspector_pci',
        header: () => (
          <Flex justify="center" align={'center'} gap="1" width={'100%'}>
            <span>Pci</span>
            <PersonIcon />
          </Flex>
        ),
        cell: (info) => {
          const value = info.getValue()!;
          return (
            <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
              <VideoAnalysisProgress pciScore={value} progress={100} />
            </Flex>
          );
        },
      }),

      columnHelper.accessor((row) => row.road_data, {
        id: 'qc_pci_gauge_min',
        header: () => <span style={{ margin: 'auto' }}>Pci QC</span>,
        cell: (info) => {
          return (
            <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
              <VideoAnalysisScoreGauge
                min={info.getValue()?.qc_pci_gauge_min}
                max={info.getValue()?.qc_pci_gauge_max}
              />
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
          const value = Math.round(Math.random() * 60) + 40;
          const progress = Math.min(100, Math.round(Math.random() * 70) + 50);
          return (
            <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
              <VideoAnalysisProgress pciScore={value} progress={progress} />
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
    ],
    [processingConfiguration, checkedRowIds],
  );
};

export { useColumnsDef };
