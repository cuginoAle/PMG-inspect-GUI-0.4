'use client';
import { useCallback, useEffect } from 'react';
import mapboxgl, {
  DataDrivenPropertyValueSpecification,
  LngLatLike,
} from 'mapbox-gl';

type PathsToDraw = Record<
  string,
  { coordinates: LngLatLike[]; color?: string }
>;

const baseWidth = 4;
const baseZoom = 16;
const baseHighligthedWidth = 20;

const maxZoomLevel = 16;
const mapPanDuration = 2000;

const exponentinalLineWidth: DataDrivenPropertyValueSpecification<number> = {
  type: 'exponential',
  base: 2,
  stops: [
    [0, baseWidth],
    [13, baseWidth],
    [22, 2 * Math.pow(2, 22 - baseZoom)],
  ],
};

const exponentinalHighligthedLineWidth: DataDrivenPropertyValueSpecification<number> =
  {
    type: 'exponential',
    base: 2,
    stops: [
      [0, baseHighligthedWidth],
      [13, baseHighligthedWidth],
      [22, 2 * Math.pow(2, 22 - baseZoom)],
    ],
  };

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
  // Effect for drawing all base paths (only re-runs when pathsToDraw changes)
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
      { key: string; color: string }
    >[] = [];
    const pathKeys = Object.keys(props.pathsToDraw);

    (pathKeys || []).forEach((key) => {
      const pathData = props.pathsToDraw?.[key];
      const coordinates = pathData?.coordinates || [];
      const color = pathData?.color || '#1612fa';
      const normalizedPath = coordinates
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
        properties: { key, color },
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
      { key: string; color: string }
    > = {
      type: 'FeatureCollection',
      features,
    };

    if (map && !map.getSource(sourceId)) {
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
          'line-color': ['get', 'color'],
          'line-opacity': 0.7,
          'line-width': exponentinalLineWidth,
        },
      });
    }

    // Auto fit/pan after drawing
    if (bounds && totalPoints > 0) {
      if (totalPoints === 1 && firstCoord) {
        // Single point: center without changing zoom
        map.setCenter(firstCoord);
      } else {
        map.fitBounds(bounds, { padding: 20, duration: mapPanDuration });
      }
    }

    return () => {
      // Cleanup layers and sources on unmount or when paths change
      if (!map) return;
      const layerId = 'paths-layer';
      const sourceId = 'paths-source';
      const highlightLayerId = 'highlight-path-layer';
      const highlightSourceId = 'highlight-path-source';
      try {
        if (map?.getLayer(highlightLayerId)) map.removeLayer(highlightLayerId);
        if (map?.getSource(highlightSourceId))
          map.removeSource(highlightSourceId);
        if (map?.getLayer(layerId)) map.removeLayer(layerId);
        if (map?.getSource(sourceId)) map.removeSource(sourceId);
      } catch (error) {
        console.log('error', error);
      }
    };
  }, [props.styleLoaded, props.pathsToDraw, props.mapRef]);

  // Separate effect for highlighting a specific path (only re-runs when highlightPath changes)
  useEffect(() => {
    if (!props.styleLoaded || !props.mapRef.current || !props.pathsToDraw)
      return;

    const map = props.mapRef.current;
    const highlightSourceId = 'highlight-path-source';
    const highlightLayerId = 'highlight-path-layer';

    // If no highlight path is specified, remove the highlight layer
    if (!props.highlightPath) {
      try {
        if (map.getLayer(highlightLayerId)) map.removeLayer(highlightLayerId);
        if (map.getSource(highlightSourceId))
          map.removeSource(highlightSourceId);
      } catch (error) {
        console.log('error removing highlight layer', error);
      }
      return;
    }

    // Get the highlighted path coordinates
    const highlightPathData = props.pathsToDraw[props.highlightPath];
    const highlightCoords = highlightPathData?.coordinates || [];
    if (!highlightCoords || highlightCoords.length === 0) {
      // Path key exists but has no coordinates, remove highlight
      try {
        if (map.getLayer(highlightLayerId)) map.removeLayer(highlightLayerId);
        if (map.getSource(highlightSourceId))
          map.removeSource(highlightSourceId);
      } catch (error) {
        console.log('error removing highlight layer', error);
      }
      return;
    }

    const normalizedHighlightPath = highlightCoords
      .map(normalizeCoord)
      .filter(isFiniteCoord);

    if (normalizedHighlightPath.length === 0) return;

    const highlightFeature: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: normalizedHighlightPath,
      },
    };

    const highlightCollection: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
      type: 'FeatureCollection',
      features: [highlightFeature],
    };

    // Add or update the highlight source
    if (!map.getSource(highlightSourceId)) {
      map.addSource(highlightSourceId, {
        type: 'geojson',
        data: highlightCollection,
      });
    } else {
      const src = map.getSource(highlightSourceId) as
        | mapboxgl.GeoJSONSource
        | undefined;
      src?.setData(highlightCollection);
    }

    // Add the highlight layer if it doesn't exist
    // Insert it before the paths layer so it renders underneath
    if (!map.getLayer(highlightLayerId)) {
      const pathsLayerId = 'paths-layer';
      map.addLayer(
        {
          id: highlightLayerId,
          type: 'line',
          source: highlightSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ffb404',
            'line-opacity': 0.7,
            'line-width': exponentinalHighligthedLineWidth,
          },
        },
        pathsLayerId,
      );
    }
  }, [props.styleLoaded, props.highlightPath, props.pathsToDraw, props.mapRef]);

  const panToPath = useCallback(
    ({
      pathData,
      padding = 30,
    }: {
      pathData?: LngLatLike[];
      padding?: number;
    }) => {
      if (!props.mapRef.current) {
        return;
      }

      const map = props.mapRef.current;

      if (!pathData || pathData.length === 0) {
        return;
      }

      const normalizedPath = pathData.map(normalizeCoord).filter(isFiniteCoord);

      if (normalizedPath.length === 0) {
        return;
      }

      if (normalizedPath.length === 1) {
        const firstPoint = normalizedPath[0];
        if (firstPoint) {
          map.easeTo({
            center: firstPoint,
            zoom: Math.min(map.getZoom(), maxZoomLevel),
            duration: mapPanDuration,
          });
        }
        return;
      }

      const firstPoint = normalizedPath[0];
      if (!firstPoint) return;

      const bounds = normalizedPath
        .slice(1)
        .reduce(
          (b, coord) => b.extend(coord),
          new mapboxgl.LngLatBounds(firstPoint, firstPoint),
        );

      map.fitBounds(bounds, {
        padding,
        duration: mapPanDuration,
        maxZoom: maxZoomLevel,
      });
    },
    [props.mapRef],
  );

  return { panToPath };
};

export type { PathsToDraw };
