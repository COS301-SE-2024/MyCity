"use client";

import { ReactNode, createContext, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl, { LngLatLike, Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import placekit, { PKResult } from "@placekit/client-js";
import CustomMarker from "../../public/customMarker.svg";

export interface MapboxContextProps {
    map: Map | null;
    setMap: (map: Map | null) => void;
    selectedAddress: PKResult | null;
    dropMarker: (pkResult?: PKResult) => void;
    liftMarker: () => void;
    flyTo: (lng: number | undefined, lat: number | undefined) => void;
    flyToCurrentLocation: () => void;
}

const MapboxContext = createContext<MapboxContextProps>({
    map: null,
    setMap: () => { },
    selectedAddress: null,
    dropMarker: () => { },
    liftMarker: () => { },
    flyTo: () => { },
    flyToCurrentLocation: () => { }
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
        <MapboxContext.Provider value={{ map, setMap, selectedAddress, dropMarker, liftMarker, flyTo, flyToCurrentLocation }}>
            {children}
        </MapboxContext.Provider>
    );
};

export default MapboxContext;