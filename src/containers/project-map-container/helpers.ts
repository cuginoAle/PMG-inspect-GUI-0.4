import { PathsToDraw } from '@/src/components';
import { GpsData } from '@/src/types';

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

export { getPathsMapData };
