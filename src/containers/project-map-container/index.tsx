'use client';
import { useGlobalState } from '@/src/app/global-state';
import { GpsData } from '@/src/types';
import { Map, PathsToDraw } from 'components/map';
import { useEffect, useState } from 'react';

const getMapData = (
  gpsData: GpsData | null | undefined,
): PathsToDraw | undefined => {
  // Logic to get map data based on selectedVideo
  if (gpsData) {
    const data = gpsData.reduce((acc, current) => {
      if (current) {
        acc.push([current.longitude, current.latitude]);
      }

      return acc;
    }, [] as [number, number][]);

    return [data];
  }

  return undefined;
};

const ProjectMapContainer = () => {
  const gState = useGlobalState();
  const selectedVideo = gState.selectedVideo.get({
    noproxy: true,
  });
  const [pathsToDraw, setPathsToDraw] = useState<PathsToDraw>();

  useEffect(() => {
    if (selectedVideo && !('status' in selectedVideo)) {
      const data = selectedVideo.gps_data;

      setPathsToDraw(getMapData(data as GpsData | null | undefined));
    }
  }, [selectedVideo]);

  return <Map pathsToDraw={pathsToDraw} />;
};

export { ProjectMapContainer };
