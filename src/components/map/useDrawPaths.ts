'use client';
import { useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

type PathsToDraw = Record<string, LngLatLike[]>;

// Normalize any LngLatLike into a [lng, lat] tuple using Mapbox's built-in converter
const normalizeCoord = (p: LngLatLike): [number, number] => {
  try {
    const ll = mapboxgl.LngLat.convert(p);
    return [ll.lng, ll.lat];
  } catch {
    // Fallback for unexpected shapes; will be filtered out by isFiniteCoord
    return [Number.NaN, Number.NaN];
  }
};

const isFiniteCoord = (c: [number, number]) =>
  Number.isFinite(c[0]) && Number.isFinite(c[1]);

interface DrawPathsProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  styleLoaded: boolean;
  pathsToDraw?: PathsToDraw;
  highlightPath?: string;
}

export const useDrawPaths = (props: DrawPathsProps) => {
  useEffect(() => {
    if (
      !props.styleLoaded ||
      !props.mapRef.current ||
      !props.pathsToDraw ||
      Object.keys(props.pathsToDraw).length === 0
    )
      return;

    const map = props.mapRef.current;

    let bounds: mapboxgl.LngLatBounds | null = null;
    let totalPoints = 0;
    let firstCoord: [number, number] | null = null;

    // Build a FeatureCollection of LineString features; each path is a separate feature
    const features: GeoJSON.Feature<
      GeoJSON.LineString,
      { key: string; highlight: boolean }
    >[] = [];
    const pathKeys = Object.keys(props.pathsToDraw);

    (pathKeys || []).forEach((key) => {
      const normalizedPath = (props.pathsToDraw?.[key] || [])
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

      features.push({
        type: 'Feature',
        properties: { key, highlight: key === props.highlightPath },
        geometry: {
          type: 'LineString',
          coordinates: normalizedPath,
        },
      });
    });

    // If no valid lines, skip
    if (features.length === 0) return;

    const sourceId = 'paths-source';
    const layerId = 'paths-layer';

    const collection: GeoJSON.FeatureCollection<
      GeoJSON.LineString,
      { key: string; highlight: boolean }
    > = {
      type: 'FeatureCollection',
      features,
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: collection,
      });
    } else {
      const src = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
      src?.setData(collection);
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
          // Red when feature.highlight is true, else default color
          'line-color': [
            'case',
            ['==', ['get', 'highlight'], true],
            '#ff0000',
            '#9f8562',
          ],
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
  }, [props.styleLoaded, props.pathsToDraw, props.highlightPath, props.mapRef]);
};

export type { PathsToDraw };
