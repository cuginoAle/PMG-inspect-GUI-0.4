'use client';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/getResponseIfSuccesful';
import { GpsData, Project, VideoData } from '@/src/types';
import { Map, PathsToDraw } from 'components/map';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';

const getMapData = (
  gpsData: GpsData[] | null | undefined,
): PathsToDraw | undefined => {
  // Logic to get map data based on selectedVideo
  if (gpsData) {
    const data = gpsData.reduce((acc, current) => {
      if (current) {
        acc.push(current.map((point) => [point.longitude, point.latitude]));
      }

      return acc;
    }, [] as [number, number][][]);

    return data;
  }

  return undefined;
};

const ProjectMapContainer = () => {
  const [pathsToDraw, setPathsToDraw] = useState<PathsToDraw>();
  const gState = useGlobalState();
  const project = gState.selectedProject.get({ noproxy: true });
  const selectedProject = getResponseIfSuccesful<Project>(project as Project);

  useEffect(() => {
    selectedProject &&
      // Fetch video metadata from IndexedDB for all project items
      Cache.get<VideoData>(
        'videoMetadata',
        selectedProject.project_items.map((item) => item.video_url),
      )
        .then((data) => {
          const filteredData = data.filter((d) => !!d);
          const gpsData = filteredData.map((d) => d.gps_data) as GpsData[];

          setPathsToDraw(getMapData(gpsData));
        })
        .catch((e) => {
          // ignore cache errors
          console.error('Error fetching from cache', e);
        });
  }, [selectedProject]);

  if (!pathsToDraw) return null;
  return <Map pathsToDraw={pathsToDraw} />;
};

export { ProjectMapContainer };
