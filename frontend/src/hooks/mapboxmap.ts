import { useEffect } from "react";
import mapboxgl, { LngLatLike, Map, Marker } from 'mapbox-gl';

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

const RenderMap = (
  longitude: number,
  latitude: number,
  zoom = 14,
  containerId = 'map',
  style = 'mapbox://styles/mapbox/streets-v12'
) => {
  // Set max bounds to lock the map to South Africa
  const boundsSA: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
    [16.0, -35.0], // Southwest corner
    [33.0, -22.0], // Northeast corner
  ];

  const map = new mapboxgl.Map({
    container: containerId, // container ID
    style: style, // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: zoom, // starting zoom
  });

  map.setMaxBounds(boundsSA);

  // Add navigation controls (zoom and rotation)
  map.addControl(new mapboxgl.NavigationControl());

  return map;
};

export default RenderMap;