'use client';
import { useGlobalState } from '@/src/app/global-state';
import { GpsData } from '@/src/types';
import { Map, PathsToDraw, useDrawPaths } from '@/src/components';
import { useEffect, useState, useRef } from 'react';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { useSearchParams } from 'next/navigation';

const getMapData = (
  gpsData: Record<string, GpsData[] | null | undefined>,
): PathsToDraw | undefined => {
  // Logic to get map data based on selectedVideo
  if (gpsData) {
    const paths = Object.keys(gpsData);
    const data = paths.reduce((acc, curr) => {
      if (gpsData[curr]) {
        acc[curr] = gpsData[curr].map((point) => [
          point.longitude,
          point.latitude,
        ]);
      }
      return acc;
    }, {} as PathsToDraw);

    return data;
  }

  return undefined;
};

const ProjectMapContainer = () => {
  const sp = useSearchParams();
  const videoUrl = sp.get('videoUrl') || undefined;

  const [pathsToDraw, setPathsToDraw] = useState<PathsToDraw>();
  const hoveredVideoUrl = useGlobalState((state) => state.hoveredVideoUrl);
  const selectedProjectData = useGlobalState((state) => state.selectedProject);

  const selectedProject = getResponseIfSuccesful(selectedProjectData);

  const mapBoxRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    if (!selectedProject) {
      setPathsToDraw(undefined);
      return;
    }

    const gpsData = selectedProject.items
      ? Object.keys(selectedProject.items).reduce((acc, key) => {
          const item = selectedProject.items?.[key];
          if (item?.gps_points) {
            acc[key] = Object.values(item.gps_points);
          }
          return acc;
        }, {} as Record<string, GpsData[] | null | undefined>)
      : {};

    setPathsToDraw(getMapData(gpsData));
  }, [selectedProject]);

  useDrawPaths({
    mapRef: mapBoxRef,
    styleLoaded,
    pathsToDraw,
    highlightPath: hoveredVideoUrl || videoUrl,
  });

  if (!pathsToDraw) return null;
  return <Map ref={mapBoxRef} onStyleLoaded={setStyleLoaded} />;
};

export { ProjectMapContainer };
