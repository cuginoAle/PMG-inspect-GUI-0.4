import { createColumnHelper } from '@tanstack/react-table';
import type {
  AugmentedProjectItemData,
  ProcessingConfiguration,
} from '@/src/types';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import {
  CalculatorIcon,
  NeuralNetworkIcon,
  VideoAnalysisProgress,
  VideoAnalysisScoreGauge,
} from '@/src/components';
import { parsingMap, statusColorsMap, statusTitleMap } from './constants';
import { useMemo } from 'react';

const getTreatment = (pciScore: number | undefined) => {
  if (pciScore === undefined) return 'N/A';
  if (pciScore >= 90) {
    return 'Rejuvenation';
  } else if (pciScore >= 70) {
    return 'Maintenance';
  } else if (pciScore >= 50) {
    return 'Preservation';
  } else if (pciScore >= 30) {
    return 'Structural';
  } else {
    return 'Rehabilitation';
  }
};

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
            <div
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {/* Invisible label to make the expand the checkbox clickable area */}
              <label
                className="rowCheckBox"
                htmlFor={info.row.original.video_url}
              />
              <input
                id={info.row.original.video_url}
                name="selectedRowCheckbox"
                value={info.row.original.video_url}
                type="checkbox"
                data-component-id="row-select-checkbox"
                onChange={() => void 0}
                defaultChecked={checkedRowIds?.includes(
                  info.row.original.video_url,
                )}
              />
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => `${row.video_name}`, {
        id: 'video_name',
        header: 'Video name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.road_data?.road_surface, {
        id: 'road_surface',
        header: 'Surface type',
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor((row) => row.selected_configuration, {
        id: 'configuration',
        header: 'Proc. Configuration',
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

      columnHelper.accessor((row) => row.road_data?.inspector_pci, {
        id: 'inspector_pci',
        header: () => (
          <Flex justify="center" align={'center'} gap="1" width={'100%'}>
            <PersonIcon />
            <span>Pci</span>
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

      columnHelper.accessor(
        (row) =>
          row.road_data?.qc_pci_gauge_min && row.road_data?.qc_pci_gauge_max
            ? row.road_data?.qc_pci_gauge_min +
              row.road_data?.qc_pci_gauge_max / 100 // to keep both values in a single number
            : undefined,
        {
          id: 'qc_pci_gauge_min',
          header: () => <span style={{ margin: 'auto' }}>QC Pci</span>,
          cell: (info) => {
            const value = info.getValue()?.toString().split('.');
            const min = value ? value[0] : undefined;
            const max = value ? value[1] : undefined;
            return (
              <Flex justify="center" gap="1">
                <VideoAnalysisScoreGauge
                  min={min ? parseInt(min) : undefined}
                  max={max ? parseInt(max) : undefined}
                />
              </Flex>
            );
          },
        },
      ),

      columnHelper.accessor(
        (row) => {
          const min = row.road_data?.qc_pci_gauge_min;
          const max = row.road_data?.qc_pci_gauge_max;
          const inspectorPciScore = row.road_data?.inspector_pci;

          if (!min || !max || !inspectorPciScore) {
            return undefined;
          }

          if (inspectorPciScore < min) return min - inspectorPciScore + 0.1; // add 0.1 to indicate negative delta
          if (inspectorPciScore > max) return inspectorPciScore - max;
          return 0;
        },
        {
          id: 'pci_delta',
          header: () => (
            <Flex align={'center'} style={{ margin: 'auto' }}>
              <NeuralNetworkIcon size={1.3} />/ QC
            </Flex>
          ),
          cell: (info) => {
            const value = info.getValue() || 0;
            const roundedValue = Math.round(value);
            const isNegative = value !== roundedValue;
            return (
              <Text as="p" weight={'bold'} align="center" color="red">
                {isNegative ? '-' : !!value && '+'}
                {roundedValue || ''}
              </Text>
            );
          },
        },
      ),

      columnHelper.display({
        id: 'pci_score_avg_ai',
        header: () => (
          <Flex align={'center'} style={{ margin: 'auto' }} gap="1">
            <NeuralNetworkIcon size={1.8} />
            <span>Pci</span>
          </Flex>
        ),
        cell: (info) => {
          const value = undefined; //aiPciScores[info.row.original.video_url];
          const framesCount = Object.keys(value || {}).length;
          const processedCount = Object.values(value || {}).filter(
            (v) => v !== null && v !== undefined,
          ).length;

          const progress =
            framesCount > 0
              ? Math.round((processedCount / framesCount) * 100)
              : 100;

          return (
            <Flex justify="center" gap="1" style={{ fontSize: '1.7rem' }}>
              {value === undefined ? (
                <Spinner size="2" />
              ) : (
                <VideoAnalysisProgress pciScore={value} progress={progress} />
              )}
            </Flex>
          );
        },
      }),

      columnHelper.accessor((row) => row.road_data?.inspector_pci, {
        id: 'ai_treatment',
        header: () => (
          <Flex
            align={'center'}
            style={{ margin: 'auto' }}
            gap="1"
            title="Calculated treatment"
          >
            <CalculatorIcon size={1.4} />
            <span>Treat.</span>
          </Flex>
        ),
        cell: (info) => {
          const value = info.getValue();
          return (
            <Text as="p" align={'center'}>
              {getTreatment(value || undefined)}
            </Text>
          );
        },
      }),

      columnHelper.accessor((row) => row.road_data?.inspector_pci, {
        id: 'predicted_treatment',
        header: () => (
          <Flex
            align={'center'}
            style={{ margin: 'auto' }}
            gap="1"
            title="Predicted treatment"
          >
            <NeuralNetworkIcon size={1.8} />
            <span>Treat.</span>
          </Flex>
        ),
        cell: (info) => {
          const value = info.getValue();
          return (
            <Text as="p" align={'center'} title="Predicted treatment">
              {' '}
              -{' '}
            </Text>
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
