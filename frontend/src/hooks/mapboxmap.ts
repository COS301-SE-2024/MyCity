import { useEffect } from "react";
import mapboxgl, {Map, Marker } from 'mapbox-gl';

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

const RenderMap = (longitude : number, latitude : number, zoom = 14, containerId = 'map', style = 'mapbox://styles/mapbox/streets-v12') => {
    useEffect(() => {
      const map = new mapboxgl.Map({
        container: containerId, // container ID
        style: style, // style URL
        center: [Number(longitude), Number(latitude)], // starting position [lng, lat]
        zoom: zoom // starting zoom
      });
  
      new mapboxgl.Marker()
        .setLngLat([Number(longitude), Number(latitude)])
        .addTo(map);
  
      return () => map.remove();
    }, []);
  };

  export default RenderMap;