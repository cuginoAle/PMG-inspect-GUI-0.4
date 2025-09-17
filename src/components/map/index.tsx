'use client';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import styles from './style.module.css';
import { LngLatLike } from 'mapbox-gl';
import { useDrawPaths } from './useDrawPaths';
import { useDebounce } from '@/src/hooks/useDebounce';

const STANDARD_MAP_STYLE = 'mapbox://styles/mapbox/standard';
const SATELLITE_MAP_STYLE = 'mapbox://styles/mapbox/satellite';

const MAP_STYLE = {
  standard: STANDARD_MAP_STYLE,
  satellite: SATELLITE_MAP_STYLE,
};

type PathsToDraw = LngLatLike[][];

interface MapProps {
  pathsToDraw?: PathsToDraw;
}

const Map = ({ pathsToDraw }: MapProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiY3VnaW5vYWxlIiwiYSI6ImNtZWZvOGs0djB0c3UyaXM5dDhhM3k5eGUifQ.gL7XlJOF-fF42nZaeNnMAw';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: MAP_STYLE.standard,
      center: [-74.0242, 40.6941],
      zoom: 10.12,
    });

    mapRef.current.on('style.load', () => {
      setStyleLoaded(true);
      mapRef.current?.resize();
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

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

  useDrawPaths(mapRef, styleLoaded, pathsToDraw);

  return <div className={styles.root} ref={mapContainerRef} />;
};

export { Map };
export type { PathsToDraw };
