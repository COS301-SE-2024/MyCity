import { useEffect, useRef } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapbox } from "@/hooks/useMapbox";

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

interface MapboxMapProps {
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
}

const MapboxMap: React.FC = () => {
    const { map, setMap } = useMapbox(); // access the map and setMap from context
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // reference to the map container

    useEffect(() => {
          if (mapContainerRef.current) {
            //set max bounds to lock the map to South Africa
            const boundsSA: [LngLatLike, LngLatLike] = [
                [16.0, -35.0], // Southwest coordinates (lng, lat)
                [33.0, -22.0]  // Northeast coordinates (lng, lat)
            ];

            const initializedMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: [28.23142, -25.75442],
                zoom: 10,
                maxBounds: boundsSA
            });
          
          setMap(initializedMap); // save the map instance in context
    
          // cleanup the map on component unmount
          return () => {
            if (initializedMap) initializedMap.remove();
          };
        }
      }, [map, setMap]);

    return (
        <div className="w-full h-full relative z-40" ref={mapContainerRef}></div>
        // <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }}></div>
    );
};

export default MapboxMap;