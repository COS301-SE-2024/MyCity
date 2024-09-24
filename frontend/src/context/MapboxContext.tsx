'use client';

import { ReactNode, createContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl, { LngLatLike, Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import placekit, { PKResult } from '@placekit/client-js';
import { FaultGeoData } from '@/types/custom.types';
import CustomMarker from '../../public/customMarker.svg';

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
    setMap: () => {},
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


    const faultMap = useRef<Map | null>(null);
    let faultMapMarkers: Marker[] = [];

    const faultData: FaultGeoData[] = [];

    const currentMarker = useRef<Marker | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<PKResult | null>(null);

    const municipalityCoordinates = useRef<LngLatLike | null>(null);


    // const setMap = (map: Map) => {
    //     setMap(map);
    // }


    const dropMarker = async(pkResult?: PKResult) => {
        if (map) {
            if (markerRef.current) {
                markerRef.current.remove(); // remove existing marker if present
            }

            if (!pkResult) {
                //drop marker on center of map (current location)
                const mapCenter = map.getCenter();
                markerRef.current = new mapboxgl.Marker({ anchor: "bottom" })
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
                    markerRef.current = new mapboxgl.Marker({ anchor: "bottom" })
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
                    if (map) {
                        map.flyTo({
                            center: [longitude, latitude],
                            zoom: 14,
                            essential: true, // animation is considered essential for accessibility
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


    const initialiseFaultMap = async (faultMapContainerRef: React.RefObject<HTMLDivElement>, faultGeodata: FaultGeoData[], municipality?: string) => {
        if (faultMap.current) {
            // faultMap.current.resize();
            // return faultMap;
            faultMapMarkers = [];
        }

        // use pk to get coordinates of user's municipality
        if (!municipalityCoordinates.current && municipality) {
            const response = await pk.search(
                municipality,
                {
                    countries: ["za"],
                    types: ["county"],
                    maxResults: 1,
                    language: "en"
                });

            if (response.resultsCount > 0) {
                const coordinates = response.results[0].coordinates.split(",");
                const muniLat = Number(coordinates[0].trim());
                const muniLng = Number(coordinates[1].trim());
                municipalityCoordinates.current = [muniLng, muniLat];
            }
        }



        //set max bounds to lock the map to South Africa
        const boundsSA: [LngLatLike, LngLatLike] = [
            [16.0, -35.0], // Southwest coordinates (lng, lat)
            [33.0, -22.0]  // Northeast coordinates (lng, lat)
        ];

        if (!municipalityCoordinates.current) {
            municipalityCoordinates.current = [28.23142, -25.75442];
        }

        faultMap.current = new mapboxgl.Map({
            container: faultMapContainerRef.current!,
            center: municipalityCoordinates.current,
            zoom: 10,
            maxBounds: boundsSA
        });

        //store fault data
        for (const feature of faultGeodata) {
            faultData.push(feature);
        }

        // initial fault marker display
        faultMap.current.on("load", () => {
            displayFaultMarkers();
        });

        // event listener for when the map has finished panning and zooming
        faultMap.current.on("moveend", () => {
            // display fault markers within the new viewport bounds
            displayFaultMarkers();
        });

        return faultMap;
    };


    const displayFaultMarkers = () => {
        //if fault map is not initialised or its zoom level is below 9,
        // clear all (potentially) existing markers and then return
        if (!faultMap.current || faultMap.current.getZoom() < 9) {
            document.querySelectorAll(".mapboxgl-marker").forEach(marker => marker.remove());
            faultMapMarkers = [];
            return;
        }

        // get the current bounds of the fault map's viewport
        const bounds = faultMap.current.getBounds();

        if (!bounds) {
            return;
        }

        // clear all existing markers that are outside of new viewport bounds
        const newFaultMapMarkers: Marker[] = [];
        faultMapMarkers.forEach(marker => {
            const markerLngLat = marker.getLngLat();
            if (bounds.contains([markerLngLat.lng, markerLngLat.lat])) {
                newFaultMapMarkers.push(marker);
                return;
            }
            marker.remove();

        });
        faultMapMarkers = newFaultMapMarkers;

        // iterate over the fault data and check if the coordinates are within the bounds
        faultData.forEach(feature => {
            const [lng, lat] = [Number(feature.longitude), Number(feature.latitude)];

            if (bounds.contains([lng, lat]) && !markerExistsWithCoordinates(lng, lat)) {
                const faultMarkerIcon = createFaultMarker(feature.color); //create the relevant colour-coded marker
                // create a new marker and add it to the map
                const faultMarker = new mapboxgl.Marker({
                    element: faultMarkerIcon
                }).setLngLat([lng, lat])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups if needed
                        .setText(feature.asset_id))
                    .addTo(faultMap.current!);

                faultMapMarkers.push(faultMarker);
            }
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

    const markerExistsWithCoordinates = (lng: number, lat: number) => {
        const result = faultMapMarkers.some(marker => {
            const markerLngLat = marker.getLngLat();
            return markerLngLat.lng === lng && markerLngLat.lat === lat;
        });
        return result;
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