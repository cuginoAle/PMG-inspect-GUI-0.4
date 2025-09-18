'use client';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/getResponseIfSuccesful';
import { GpsData, Project, VideoData } from '@/src/types';
import { Map } from 'components/map';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import { PathsToDraw, useDrawPaths } from '@/src/components/map/useDrawPaths';

const getMapData = (
  gpsData: Record<string, GpsData> | null | undefined,
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
  const [pathsToDraw, setPathsToDraw] = useState<PathsToDraw>();
  const gState = useGlobalState();
  const project = gState.selectedProject.get({ noproxy: true });
  const selectedProject = getResponseIfSuccesful<Project>(project as Project);
  const hoveredVideoUrl = gState.hoveredVideoUrl.get();
  const selectedVideo = gState.selectedVideo.get({ noproxy: true });

  // Fetch video metadata from IndexedDB for all project items
  // This should ideally come from one api call that fetches metadata for all the project videos
  const videoMetadata = useMemo(() => {
    return selectedProject
      ? Cache.get<VideoData>(
          'videoMetadata',
          selectedProject.project_items.map((item) => item.video_url),
        )
      : Promise.resolve([]);
  }, [selectedProject]);

  const mapBoxRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    selectedProject &&
      videoMetadata
        .then((data) => {
          const gpsData = data.reduce((acc, d, index) => {
            const key = selectedProject.project_items[index]?.video_url;
            if (key && d?.gps_data) {
              acc[key] = d.gps_data;
            }
            return acc;
          }, {} as Record<string, GpsData>);

          setPathsToDraw(getMapData(gpsData));
        })
        .catch((e) => {
          // ignore cache errors
          console.error('Error fetching from cache', e);
        });
  }, [videoMetadata, selectedProject]);

  useDrawPaths({
    mapRef: mapBoxRef,
    styleLoaded,
    pathsToDraw,
    highlightPath:
      hoveredVideoUrl || (selectedVideo as VideoData)?.media_data?.url,
  });

  if (!pathsToDraw) return null;
  return <Map ref={mapBoxRef} onStyleLoaded={setStyleLoaded} />;
};

export { ProjectMapContainer };
