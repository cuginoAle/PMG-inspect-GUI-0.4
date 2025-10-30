'use client';
import { useGlobalState } from '@/src/app/global-state';
import { GpsData, ProjectItem } from '@/src/types';
import { Map, PathsToDraw, useDrawPaths } from '@/src/components';
import { useEffect, useState, useRef, useMemo } from 'react';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { useSearchParams } from 'next/navigation';
import { pciScoreColourCodes } from '@/src/helpers/pci-score-colour-codes';
import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';

const getMapData = (
  gpsData: Record<
    string,
    { gpsPoints: GpsData[]; color?: string } | null | undefined
  >,
): PathsToDraw | undefined => {
  // Logic to get map data based on selectedVideo
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

const ProjectMapContainer = () => {
  const sp = useSearchParams();
  const videoUrl = sp.get('videoUrl') || undefined;
  const page = sp.get('page') || 0;

  const [pathsToDraw, setPathsToDraw] = useState<PathsToDraw>();
  const videoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.videoUrlToDrawOnTheMap,
  );

  const linkMapAndTable = useGlobalState((state) => state.linkMapAndTable);
  const renderedProjectItems = useGlobalState(
    (state) => state.renderedProjectItems,
  );

  const setVideoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.setVideoUrlToDrawOnTheMap,
  );
  const hoveredVideoUrl = useGlobalState((state) => state.hoveredVideoUrl);
  const selectedProjectData = useGlobalState((state) => state.selectedProject);

  const selectedProject = getResponseIfSuccesful(selectedProjectData);

  const selectedVideo =
    videoUrlToDrawOnTheMap && selectedProject?.items?.[videoUrlToDrawOnTheMap];

  const mapBoxRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);

  const [itemsToRender, setItemsToRender] = useState<
    Record<string, ProjectItem> | undefined
  >();

  useEffect(() => {
    // Determine which items to render based on linkMapAndTable state
    if (linkMapAndTable) {
      setItemsToRender(renderedProjectItems);
    } else {
      setItemsToRender(selectedProject?.items);
    }
  }, [linkMapAndTable, renderedProjectItems, selectedProject]);

  useEffect(() => {
    if (linkMapAndTable) {
      // When map and table are linked, zoom out to show all paths
      setVideoUrlToDrawOnTheMap(undefined);
    }
  }, [linkMapAndTable, page, setVideoUrlToDrawOnTheMap]);

  useEffect(() => {
    if (!selectedProject) {
      setPathsToDraw(undefined);
      return;
    }

    const gpsData = itemsToRender
      ? Object.keys(itemsToRender).reduce((acc, key) => {
          const item = itemsToRender?.[key];
          if (item?.gps_points) {
            acc[key] = {
              gpsPoints: Object.values(item.gps_points),
              color:
                pciScoreColourCodes[
                  getPciScoreLabelFromValue(
                    item.road_data?.inspector_pci || undefined,
                  )
                ],
            };
          }
          return acc;
        }, {} as Record<string, { gpsPoints: GpsData[]; color?: string } | null | undefined>)
      : {};

    setPathsToDraw(getMapData(gpsData));
  }, [itemsToRender, selectedProject]);

  // Memoize the highlight path to prevent unnecessary re-renders
  const highlightPath = useMemo(
    () => hoveredVideoUrl || videoUrl,
    [hoveredVideoUrl, videoUrl],
  );

  const { panToPath } = useDrawPaths({
    mapRef: mapBoxRef,
    styleLoaded,
    pathsToDraw,
    highlightPath: highlightPath,
  });

  useEffect(() => {
    if (!pathsToDraw) return;
    if (selectedVideo && selectedVideo.gps_points) {
      // If there is a selected video, pan to its path
      const gpsPointsArray = Object.values(selectedVideo.gps_points);
      const data = getMapData({
        [videoUrlToDrawOnTheMap]: { gpsPoints: gpsPointsArray },
      });
      data &&
        panToPath({
          pathData: Object.values(data)[0]?.coordinates,
          padding: 80,
        });
    } else {
      // If no selectedVideo, pan to show all paths
      const allCoordinates = Object.values(pathsToDraw).flatMap(
        (path) => path.coordinates,
      );
      panToPath({ pathData: allCoordinates });
    }
  }, [selectedVideo, videoUrlToDrawOnTheMap, pathsToDraw, panToPath]);

  if (!pathsToDraw) return null;
  return (
    <Map
      showZoomOutButton={Boolean(videoUrlToDrawOnTheMap)}
      onZoomOutButtonClick={setVideoUrlToDrawOnTheMap}
      ref={mapBoxRef}
      onStyleLoaded={setStyleLoaded}
    />
  );
};

export { ProjectMapContainer };
