"use client";

import { ReactNode, createContext, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl, { LngLatLike, Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import placekit, { PKResult } from "@placekit/client-js";
import CustomMarker from "../../public/customMarker.svg";
import { FaultGeoData } from "@/types/custom.types";

export interface MapboxContextProps {
    map: Map | null;
    setMap: (map: Map | null) => void;
    selectedAddress: PKResult | null;
    dropMarker: (pkResult?: PKResult) => void;
    liftMarker: () => void;
    flyTo: (lng: number | undefined, lat: number | undefined) => void;
    flyToCurrentLocation: () => void;
    addFaultMarkers: (faultGeoData: FaultGeoData[], map: Map) => void;
}

const MapboxContext = createContext<MapboxContextProps>({
    map: null,
    setMap: () => { },
    selectedAddress: null,
    dropMarker: () => { },
    liftMarker: () => { },
    flyTo: () => { },
    flyToCurrentLocation: () => { },
    addFaultMarkers: () => { }
});

interface MapboxProviderProps {
    children: ReactNode;
}

const apiKey = String(process.env.NEXT_PUBLIC_PLACEKIT_API_KEY);
const pk = placekit(apiKey);

export const MapboxProvider: React.FC<MapboxProviderProps> = ({ children }) => {
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null); // store marker reference
    const [selectedAddress, setSelectedAddress] = useState<PKResult | null>(null);

    const dropMarker = async (pkResult?: PKResult) => {
        if (map) {
            if (markerRef.current) {
                markerRef.current.remove(); // remove existing marker if present
            }

            if (!pkResult) {
                //drop marker on center of map (current location)
                const mapCenter = map.getCenter();
                markerRef.current = new mapboxgl.Marker()
                    .setLngLat(mapCenter)
                    .addTo(map);

                //get address of current location
                const response = await pk.reverse({
                    coordinates: `${mapCenter.lat},${mapCenter.lng}`,
                    countries: ["za"],
                    maxResults: 1,
                    types: ["street"],
                    language: "en"
                });

                if (response.resultsCount > 0) {
                    setSelectedAddress(response.results[0]);
                }
            }
            else {
                //drop marker at coordinates given in pkResult
                if (pkResult.lng && pkResult.lat) {
                    markerRef.current = new mapboxgl.Marker()
                        .setLngLat([pkResult.lng, pkResult.lat])
                        .addTo(map);
                }

                setSelectedAddress(pkResult);
            }
        }
    };

    const liftMarker = () => {
        if (markerRef.current) {
            markerRef.current.remove();
        }
    };

    const flyTo = (lng: number | undefined, lat: number | undefined) => {
        if (map) {
            if (lng && lat) {
                map.flyTo({ center: [lng, lat], zoom: 14, essential: true });
            }
        }
    }

    const flyToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const { longitude, latitude } = position.coords;
                    console.log(longitude, latitude);
                    if (map) {
                        map.flyTo({
                            center: [longitude, latitude],
                            zoom: 12,
                            speed: 1.2, // make the flying animation slower
                            curve: 1, // change the curvature of the flying animation
                            essential: true // this animation is considered essential with respect to prefers-reduced-motion
                        });
                    }
                },
                (error: GeolocationPositionError) => {
                    handleLocationError(error);
                }
            );
        }
        else {
            handleLocationError();
        }
    };

    const addFaultMarkers = (faultGeoData: FaultGeoData[], map: Map) => {
        if (faultGeoData.length === 0) {
            return;
        }

        // Ensure the map is fully loaded before adding layers and sources
        if (!map.isStyleLoaded()) {
            map.once("load", () => addFaultMarkers(faultGeoData, map));
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
        if (!map.getSource("markers")) {
            map.addSource("markers", {
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
            const source = map.getSource("markers") as mapboxgl.GeoJSONSource;
            source.setData({
                type: "FeatureCollection",
                features: features
            });
        }

        // add the clustered circles layer
        if (!map.getLayer("clusters")) {
            map.addLayer({
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
        if (!map.getLayer("cluster-count")) {
            map.addLayer({
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
        if (!map.getLayer("unclustered-point")) {
            map.addLayer({
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
        map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["clusters"]
            });
            const clusterId = features[0].properties!.cluster_id;

            (map.getSource("markers") as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: (features[0].geometry as any).coordinates,
                        zoom: zoom!
                    });
                }
            );
        });

        // add popup on unclustered point click
        map.on("click", "unclustered-point", (e) => {
            const coordinates = (e.features![0].geometry as any).coordinates.slice();
            const { title } = e.features![0].properties!;

            new mapboxgl.Popup({ closeButton: false })
                .setLngLat(coordinates)
                .setHTML(`<h3>${title}</h3>`)
                .addTo(map);
        });

        // change the cursor to a pointer when over clusters or unclustered points
        map.on("mouseenter", "clusters", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clusters", () => {
            map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "unclustered-point", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "unclustered-point", () => {
            map.getCanvas().style.cursor = "";
        });
    };

    const createFaultMarker = (color: string | undefined) => {
        const faultMarker = document.createElement("div");
        const root = ReactDOM.createRoot(faultMarker);
        if (color) {
            root.render(<CustomMarker fill={color} />);
        }
        else {
            root.render(<CustomMarker />);
        }
        return faultMarker;
    };

    const handleLocationError = (error?: GeolocationPositionError) => {
        if (error) {
            console.error(`The geolocation service failed, ${error.message}`);
        }
        else {
            console.error("Error: Browser does not support geolocation");
        }
    };


    return (
        <MapboxContext.Provider value={{ map, setMap, selectedAddress, dropMarker, liftMarker, flyTo, flyToCurrentLocation, addFaultMarkers }}>
            {children}
        </MapboxContext.Provider>
    );
};

export default MapboxContext;