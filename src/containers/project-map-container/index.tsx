'use client';
import { useGlobalState } from '@/src/app/global-state';
import { GpsData } from '@/src/types';
import { Map, PathsToDraw, useDrawPaths } from '@/src/components';
import { useEffect, useState, useRef } from 'react';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { useSearchParams } from 'next/navigation';
import { Immutable } from '@hookstate/core';

const getMapData = (
  gpsData: Record<string, Immutable<GpsData[]> | null | undefined>,
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
  const gState = useGlobalState();
  const hoveredVideoUrl = gState.hoveredVideoUrl.get();

  const selectedProject = getResponseIfSuccesful(
    gState.selectedProject.get({ noproxy: true }),
  );

  const mapBoxRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    if (!selectedProject) {
      setPathsToDraw(undefined);
      return;
    }
    const gpsData = selectedProject.project_items.reduce((acc, d, index) => {
      const key = selectedProject.project_items[index]?.video_url;
      if (key && d?.gps_points) {
        acc[key] = [...d.gps_points]; // clone to convert from readonly (ImmutableArray) to mutable array
      }
      return acc;
    }, {} as Record<string, GpsData[]>);

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
