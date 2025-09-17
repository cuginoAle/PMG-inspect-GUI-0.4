import { useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

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

export const useDrawPaths = (
  mapRef: React.RefObject<mapboxgl.Map | null>,
  styleLoaded: boolean,
  pathsToDraw?: LngLatLike[][],
) => {
  useEffect(() => {
    if (
      !styleLoaded ||
      !mapRef.current ||
      !pathsToDraw ||
      pathsToDraw.length === 0
    )
      return;

    const map = mapRef.current;

    let bounds: mapboxgl.LngLatBounds | null = null;
    let totalPoints = 0;
    let firstCoord: [number, number] | null = null;

    pathsToDraw.forEach((path, index) => {
      const normalizedPath = (path || [])
        .map(normalizeCoord)
        .filter(isFiniteCoord);

      if (normalizedPath.length === 0) return; // skip empty paths

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

      const layerId = `line-layer-${index}`;
      const sourceId = `line-source-${index}`;

      // Add source
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: normalizedPath,
            },
          },
        });
      } else {
        const src = map.getSource(sourceId) as
          | mapboxgl.GeoJSONSource
          | undefined;
        src?.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: normalizedPath },
        } as GeoJSON.Feature<GeoJSON.LineString>);
      }

      // Add layer if missing
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
    });

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
      (pathsToDraw || []).forEach((_, index) => {
        const layerId = `line-layer-${index}`;
        const sourceId = `line-source-${index}`;
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };
  }, [styleLoaded, pathsToDraw, mapRef]);
};
