import { useEffect, useRef } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { useMapbox } from "@/hooks/useMapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useProfile } from "@/hooks/useProfile";
import { getUserLocation } from "@/utils/permissions.utils";

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

interface MapboxMapProps {
  centerLng?: number;
  centerLat?: number;
  dropMarker?: boolean;
  addNavigationControl?: boolean;
  zoom?: number;
  centerOnMuni?: boolean;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ centerLng = 28.23142, centerLat = -25.75442, dropMarker = false, addNavigationControl = false, zoom = 12, centerOnMuni = false }) => {
  const { setMap } = useMapbox(); // access setMap from context
  const { getMuniLngLat } = useProfile();
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // reference to the map container
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    const initialiseMap = async () => {
      if (!mapInstanceRef.current && mapContainerRef.current) {
        //set max bounds to lock the map to South Africa
        const boundsSA: [LngLatLike, LngLatLike] = [
          [16.0, -35.0], // Southwest coordinates (lng, lat)
          [33.0, -22.0]  // Northeast coordinates (lng, lat)
        ];

        if (centerOnMuni) {
          // center map on municipality only if specified
          [centerLng, centerLat] = getMuniLngLat() || [centerLng, centerLat];
        }
        else {
          // center map on user's location if available
          const userLocation = await getUserLocation();
          [centerLng, centerLat] = userLocation || [centerLng, centerLat];
        }

        const initializedMap = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: [centerLng, centerLat],
          style: "mapbox://styles/mapbox/streets-v11",
          zoom: zoom,
          maxBounds: boundsSA
        });

        initializedMap.on("load", () => {
          mapInstanceRef.current = initializedMap;
          setMap(mapInstanceRef.current); // save the map instance in context only after it"s fully loaded

          if (dropMarker) {
            new mapboxgl.Marker()
              .setLngLat([centerLng, centerLat])
              .addTo(initializedMap);
          }

          if (addNavigationControl) {
            // Add navigation controls (zoom and rotation)
            initializedMap.addControl(new mapboxgl.NavigationControl());
          }
        });

        // cleanup the map on component unmount
        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null; // reset the map instance ref
          }
        };
      }
    };

    initialiseMap();

  }, [setMap, centerLng, centerLat, dropMarker, zoom]);


  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize(); // safely resize the map
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // cleanup listener
    };
  }, []);

  return (
    <div className="relative w-full h-full" ref={mapContainerRef} />
  );
};

export default MapboxMap;