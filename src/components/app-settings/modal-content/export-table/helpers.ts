import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import { pciScoreToEmoji } from '@/src/helpers/pci-score-colour-codes';
import { getTreatment } from '@/src/hooks/useTreatmentFromScore';
import { AugmentedProjectItemData } from '@/src/types';

const feetToMeters = (feet: number | undefined): number | undefined => {
  if (feet === undefined) return undefined;
  return +(feet * 0.3047999902464).toFixed(2);
};

const squareFeetToSquareMeters = (
  sqFeet: number | undefined,
): number | undefined => {
  if (sqFeet === undefined) return undefined;
  return +(sqFeet * 0.09290304).toFixed(2);
};

const getColumnData = (data: AugmentedProjectItemData) => [
  ['VIDEO LINK', `${data.video_name}|${data.video_url}`],
  ['UID_SUniqueID', 'N/A'], //data.road_data.UID_SUniqueID
  ['VIDEO NAME', data.video_name],
  ['VIDEO URL', data.video_url, 30],
  ['ROAD NAME', data.road_data?.road_name],
  ['SECTION', data.road_data?.road_section, 10],
  ['FROM', data.road_data?.road_from],
  ['TO', data.road_data?.road_to],
  ['LENGTH (FT)', feetToMeters(data.road_data?.road_length || undefined), 15],
  ['WIDTH (FT)', feetToMeters(data.road_data?.road_width || undefined), 15],
  [
    'AREA (SQFT)',
    squareFeetToSquareMeters(data.road_data?.road_area || undefined),
    15,
  ],
  ['FUNCTIONAL CLASS', data.road_data?.road_functional_class_type],
  ['SURFACE', data.road_data?.road_surface_type, 10],
  ['LANES', data.road_data?.road_lanes, 10],
  ['SHOULDER', data.road_data?.road_shoulder_type, 10],
  ['QC PCI GAUGE MIN', data.road_data?.qc_pci_gauge_min],
  ['QC PCI GAUGE MAX', data.road_data?.qc_pci_gauge_max],
  ['QC PCI GAUGE NOTES', 'N/A'], //data.road_data?.qc_pci_gauge_notes
  ['INSPECTOR PCI', data.road_data?.inspector_pci],
  [
    '',
    pciScoreToEmoji[getPciScoreLabelFromValue(data.road_data?.inspector_pci)],
    4,
  ],
  ['INSPECTOR NOTES', 'N/A'], //data.road_data?.inspector_notes
  ['PCI AI', data.avgPciScore],
  ['', pciScoreToEmoji[getPciScoreLabelFromValue(data.avgPciScore)], 4],
  ['TREATMENT', getTreatment(data.avgPciScore)],
  ['TREATMENT AI', data.avgTreatment],
];

export { getColumnData };
