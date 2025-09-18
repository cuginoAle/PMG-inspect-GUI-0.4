import { useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

type PathsToDraw = LngLatLike[][];

// Normalize any LngLatLike into a [lng, lat] tuple
const normalizeCoord = (p: LngLatLike): [number, number] => {
  if (Array.isArray(p)) {
    // p can be [lng, lat] (possibly with altitude). We only need first two.
    return [Number(p[0]), Number(p[1])];
  }
  if (typeof p === 'object' && p !== null) {
    // Covers LngLat instances and plain objects
    const anyP = p as any;
    if (typeof anyP.lng === 'number' && typeof anyP.lat === 'number') {
      return [anyP.lng, anyP.lat];
    }
    if (typeof anyP.lon === 'number' && typeof anyP.lat === 'number') {
      return [anyP.lon, anyP.lat];
    }
  }
  // Fallback to 0,0 if something unexpected is passed (will be filtered out later)
  return [Number.NaN, Number.NaN];
};

const isFiniteCoord = (c: [number, number]) =>
  Number.isFinite(c[0]) && Number.isFinite(c[1]);

interface DrawPathsProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  styleLoaded: boolean;
  pathsToDraw?: PathsToDraw;
}

export const useDrawPaths = (props: DrawPathsProps) => {
  useEffect(() => {
    if (
      !props.styleLoaded ||
      !props.mapRef.current ||
      !props.pathsToDraw ||
      props.pathsToDraw.length === 0
    )
      return;

    const map = props.mapRef.current;

    let bounds: mapboxgl.LngLatBounds | null = null;
    let totalPoints = 0;
    let firstCoord: [number, number] | null = null;

    // Build MultiLineString coordinates where each path is a separate line
    const multiLineCoords: number[][][] = [];

    (props.pathsToDraw || []).forEach((path) => {
      const normalizedPath = (path || [])
        .map(normalizeCoord)
        .filter(isFiniteCoord);
      if (normalizedPath.length === 0) return;

      // Extend overall bounds
      normalizedPath.forEach(([lng, lat]) => {
        totalPoints += 1;
        if (!firstCoord) firstCoord = [lng, lat];
        if (!bounds) {
          bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat]);
        } else {
          bounds.extend([lng, lat]);
        }
      });

      multiLineCoords.push(normalizedPath);
    });

    // If no valid lines, skip
    if (multiLineCoords.length === 0) return;

    const sourceId = 'paths-source';
    const layerId = 'paths-layer';

    const feature: GeoJSON.Feature<GeoJSON.MultiLineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: multiLineCoords,
      },
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: feature,
      });
    } else {
      const src = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
      src?.setData(feature);
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#9f8562',
          'line-width': 10,
        },
      });
    }

    // Auto fit/pan after drawing
    if (bounds && totalPoints > 0) {
      if (totalPoints === 1 && firstCoord) {
        // Single point: center without changing zoom
        map.setCenter(firstCoord);
      } else {
        map.fitBounds(bounds, { padding: 40, duration: 500 });
      }
    }

    return () => {
      // Cleanup layers and sources on unmount or when paths change
      if (!map) return;
      const layerId = 'paths-layer';
      const sourceId = 'paths-source';
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [props.styleLoaded, props.pathsToDraw, props.mapRef]);
};

export type { PathsToDraw };
