import { PathsToDraw, PointsToDraw } from '@/src/components';

import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import { pciScoreColourCodes } from '@/src/helpers/pci-score-colour-codes';
import { AugmentedProject, GpsData } from '@/src/types';

const getPathsMapData = (
  gpsData: Record<
    string,
    { gpsPoints: GpsData[]; color?: string } | null | undefined
  >,
): PathsToDraw | undefined => {
  // NOTE: here we are drawing ALL the frames available in gpsData, not just the processed frames!
  if (gpsData) {
    const paths = Object.keys(gpsData);
    const data = paths.reduce((acc, curr) => {
      const pathData = gpsData[curr];
      if (pathData?.gpsPoints) {
        acc[curr] = {
          coordinates: pathData.gpsPoints.map((point) => [
            point.longitude,
            point.latitude,
          ]),
          ...(pathData.color && { color: pathData.color }),
        };
      }
      return acc;
    }, {} as PathsToDraw);

    return data;
  }

  return undefined;
};

const getPointsMapData = ({
  project,
}: {
  project?: AugmentedProject;
}): PointsToDraw => {
  return Object.values(project?.items || {}).reduce((acc, item) => {
    const scores = item.aiPciScores || {};
    const pciValues = Object.entries(scores);

    if (pciValues.length === 0) return acc;

    pciValues
      .filter(([, score]) => !!score && !!score.pci_score)
      .forEach(([frameIndex, score]) => {
        const gpsPoint = item.gps_points?.[frameIndex as any];
        if (!gpsPoint) return;

        acc.push({
          coordinates: [gpsPoint.longitude, gpsPoint.latitude],
          color:
            pciScoreColourCodes[
              getPciScoreLabelFromValue(score?.pci_score || undefined)
            ],
        });
      });

    return acc;
  }, [] as PointsToDraw);
};

export { getPathsMapData, getPointsMapData };
