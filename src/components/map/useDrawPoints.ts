'use client';
import { useCallback, useEffect } from 'react';
import mapboxgl, {
  DataDrivenPropertyValueSpecification,
  LngLatLike,
} from 'mapbox-gl';

type PointsToDraw = Record<
  string,
  { coordinates: LngLatLike[]; color?: string }
>;

const baseRadius = 4;
const baseZoom = 16;

const maxZoomLevel = 16;
const mapPanDuration = 2000;

const exponentialCircleRadius: DataDrivenPropertyValueSpecification<number> = {
  type: 'exponential',
  base: 2,
  stops: [
    [0, baseRadius],
    [13, baseRadius],
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

interface DrawPointsProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  styleLoaded: boolean;
  pointsToDraw?: PointsToDraw;
  skip?: boolean;
}

export const useDrawPoints = (props: DrawPointsProps) => {
  // Effect for drawing all points as circles
  useEffect(() => {
    if (
      !props.styleLoaded ||
      !props.mapRef.current ||
      !props.pointsToDraw ||
      Object.keys(props.pointsToDraw).length === 0 ||
      props.skip
    )
      return;

    const map = props.mapRef.current;

    let bounds: mapboxgl.LngLatBounds | null = null;
    let totalPoints = 0;
    let firstCoord: [number, number] | null = null;

    // Build a FeatureCollection of Point features; each coordinate is a separate point
    const features: GeoJSON.Feature<
      GeoJSON.Point,
      { key: string; color: string }
    >[] = [];
    const pointKeys = Object.keys(props.pointsToDraw);

    (pointKeys || []).forEach((key) => {
      const pointData = props.pointsToDraw?.[key];
      const coordinates = pointData?.coordinates || [];
      const color = pointData?.color || '#1612fa';
      const normalizedPoints = coordinates
        .map(normalizeCoord)
        .filter(isFiniteCoord);
      if (normalizedPoints.length === 0) return;

      // Create a feature for each point
      normalizedPoints.forEach(([lng, lat]) => {
        totalPoints += 1;
        if (!firstCoord) firstCoord = [lng, lat];
        if (!bounds) {
          bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat]);
        } else {
          bounds.extend([lng, lat]);
        }

        features.push({
          type: 'Feature',
          properties: { key, color },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        });
      });
    });

    // If no valid points, skip
    if (features.length === 0) return;

    const sourceId = 'points-source';
    const layerId = 'points-layer';

    const collection: GeoJSON.FeatureCollection<
      GeoJSON.Point,
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
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.7,
          'circle-radius': exponentialCircleRadius,
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
      // Cleanup layers and sources on unmount or when points change
      if (!map) return;
      const layerId = 'points-layer';
      const sourceId = 'points-source';
      try {
        if (map?.getLayer(layerId)) map.removeLayer(layerId);
        if (map?.getSource(sourceId)) map.removeSource(sourceId);
      } catch (error) {
        console.log('error', error);
      }
    };
  }, [props.styleLoaded, props.pointsToDraw, props.mapRef, props.skip]);

  const panToPoints = useCallback(
    ({ data, padding = 30 }: { data?: LngLatLike[]; padding?: number }) => {
      if (!props.mapRef.current || !props.skip) {
        return;
      }

      const map = props.mapRef.current;

      if (!data || data.length === 0) {
        return;
      }

      const normalizedPoints = data.map(normalizeCoord).filter(isFiniteCoord);

      if (normalizedPoints.length === 0) {
        return;
      }

      if (normalizedPoints.length === 1) {
        const firstPoint = normalizedPoints[0];
        if (firstPoint) {
          map.easeTo({
            center: firstPoint,
            zoom: Math.min(map.getZoom(), maxZoomLevel),
            duration: mapPanDuration,
          });
        }
        return;
      }

      const firstPoint = normalizedPoints[0];
      if (!firstPoint) return;

      const bounds = normalizedPoints
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
    [props.mapRef, props.skip],
  );

  return { panToPoints: props.skip ? undefined : panToPoints };
};

export type { PointsToDraw };
