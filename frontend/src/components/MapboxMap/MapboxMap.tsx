import { useEffect, useRef } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { useMapbox } from "@/hooks/useMapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaultGeoData } from "@/types/custom.types";

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

interface MapboxMapProps {
  centerLng?: number;
  centerLat?: number;
  dropMarker?: boolean;
  addNavigationControl?: boolean;
  faultMarkers?: FaultGeoData[];
  zoom?: number;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ centerLng = 28.23142, centerLat = -25.75442, dropMarker = false, addNavigationControl = false, faultMarkers = [], zoom = 10 }) => {
  const { setMap } = useMapbox(); // access setMap from context
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // reference to the map container
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapContainerRef.current) {
      //set max bounds to lock the map to South Africa
      const boundsSA: [LngLatLike, LngLatLike] = [
        [16.0, -35.0], // Southwest coordinates (lng, lat)
        [33.0, -22.0]  // Northeast coordinates (lng, lat)
      ];

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
      });

      if (faultMarkers) {
        addFaultMarkers(initializedMap, faultMarkers);
      }
      else {
        if (dropMarker) {
          new mapboxgl.Marker()
            .setLngLat([centerLng, centerLat])
            .addTo(initializedMap);
        }

        if (addNavigationControl) {
          // Add navigation controls (zoom and rotation)
          initializedMap.addControl(new mapboxgl.NavigationControl());
        }
      }

      // cleanup the map on component unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null; // reset the map instance ref
        }
      };
    }
  }, [setMap, centerLng, centerLat, dropMarker, zoom]);


  const addFaultMarkers = (initializedMap: mapboxgl.Map, faultGeoData: FaultGeoData[]) => {
    // Ensure the map is fully loaded before adding layers and sources
    if (!initializedMap || !initializedMap.isStyleLoaded()) {
      initializedMap.once("load", () => addFaultMarkers(initializedMap, faultGeoData));
      return;
    }

    // create features from faultGeoData
    const features = faultGeoData.map((fault) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [Number(fault.longitude), Number(fault.latitude)] as [number, number],
      },
      properties: {
        title: fault.asset_id,
        color: fault.color
      },
    }));


    // add a geojson source for the markers
    if (!initializedMap.getSource("markers")) {
      initializedMap.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
        cluster: true, // enable clustering
        clusterMaxZoom: 18, // max zoom level where clusters will still occur
        clusterRadius: 50, // radius of each cluster when clustering points
      });
    } else {
      // update the data if the source already exists
      const source = initializedMap.getSource("markers") as mapboxgl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: features
      });
    }

    // add the clustered circles layer
    if (!initializedMap.getLayer("clusters")) {
      initializedMap.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            25,
            "#f1f075",
            50,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            25,
            30,
            50,
            40
          ],
        },
      });
    }

    // add the cluster count layer
    if (!initializedMap.getLayer("cluster-count")) {
      initializedMap.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });
    }

    // add the unclustered points layer
    if (!initializedMap.getLayer("unclustered-point")) {
      initializedMap.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });
    }

    // add click event listener to zoom into clusters
    initializedMap.on("click", "clusters", (e) => {
      const features = initializedMap.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });
      const clusterId = features[0].properties!.cluster_id;

      (initializedMap.getSource("markers") as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;

          initializedMap.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom!
          });
        }
      );
    });

    // add popup on unclustered point click
    initializedMap.on("click", "unclustered-point", (e) => {
      const coordinates = (e.features![0].geometry as any).coordinates.slice();
      const { title } = e.features![0].properties!;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coordinates)
        .setHTML(`<h3>${title}</h3>`)
        .addTo(initializedMap);
    });

    // change the cursor to a pointer when over clusters or unclustered points
    initializedMap.on("mouseenter", "clusters", () => {
      initializedMap.getCanvas().style.cursor = "pointer";
    });
    initializedMap.on("mouseleave", "clusters", () => {
      initializedMap.getCanvas().style.cursor = "";
    });
    initializedMap.on("mouseenter", "unclustered-point", () => {
      initializedMap.getCanvas().style.cursor = "pointer";
    });
    initializedMap.on("mouseleave", "unclustered-point", () => {
      initializedMap.getCanvas().style.cursor = "";
    });
  };


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