'use client';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import styles from './style.module.css';
import { LngLatLike } from 'mapbox-gl';
import { useDebounce } from '@/src/hooks/useDebounce';
import React from 'react';

const STANDARD_MAP_STYLE = 'mapbox://styles/mapbox/standard';
const SATELLITE_MAP_STYLE = 'mapbox://styles/mapbox/satellite';

const MAP_STYLE = {
  standard: STANDARD_MAP_STYLE,
  satellite: SATELLITE_MAP_STYLE,
};

type PathsToDraw = LngLatLike[][];

interface MapProps {
  onStyleLoaded?: (loaded: boolean) => void;
}

const Map = React.forwardRef<mapboxgl.Map | null, MapProps>(
  ({ onStyleLoaded }: MapProps, ref) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [_, setStyleLoaded] = useState(false);

    useEffect(() => {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiY3VnaW5vYWxlIiwiYSI6ImNtZWZvOGs0djB0c3UyaXM5dDhhM3k5eGUifQ.gL7XlJOF-fF42nZaeNnMAw';
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
        setStyleLoaded(true);
        onStyleLoaded && onStyleLoaded(true);
        mapRef.current?.resize();
      });

      return () => {
        mapRef.current?.remove();
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
export type { PathsToDraw };
