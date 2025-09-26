'use client';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect } from 'react';
import styles from './style.module.css';
import { useDebounce } from '@/src/hooks/useDebounce';
import React from 'react';

const STANDARD_MAP_STYLE = 'mapbox://styles/mapbox/standard';
const SATELLITE_MAP_STYLE = 'mapbox://styles/mapbox/satellite';

const MAP_STYLE = {
  standard: STANDARD_MAP_STYLE,
  satellite: SATELLITE_MAP_STYLE,
};

interface MapProps {
  onStyleLoaded?: (loaded: boolean) => void;
}

const Map = React.forwardRef<mapboxgl.Map | null, MapProps>(
  ({ onStyleLoaded }: MapProps, ref) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
        style: MAP_STYLE.standard,
        center: [-74.0242, 40.6941],
        zoom: 10.12,
      });

      if (typeof ref === 'function') {
        ref(mapRef.current);
      } else if (ref) {
        ref.current = mapRef.current;
      }

      mapRef.current.on('style.load', () => {
        onStyleLoaded && onStyleLoaded(true);
        mapRef.current?.resize();
      });

      return () => {
        mapRef.current?.remove();
        onStyleLoaded && onStyleLoaded(false);
      };
    }, [onStyleLoaded, ref]);

    const debouncedResize = useDebounce(() => {
      mapRef.current?.resize();
    }, 100);

    useEffect(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
        debouncedResize();
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [debouncedResize]);

    return <div className={styles.root} ref={mapContainerRef} />;
  },
);

Map.displayName = 'Map';

export { Map };
