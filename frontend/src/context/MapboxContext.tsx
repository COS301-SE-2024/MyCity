'use client'

import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl, { LngLatLike, Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import placekit, { PKResult } from '@placekit/client-js';
import { FaultGeoData } from '@/types/custom.types';
import CustomMarker from '../../public/customMarker.svg';

export interface MapboxContextProps {
    faultMap: MutableRefObject<mapboxgl.Map | null>;
    map: MutableRefObject<mapboxgl.Map | null>;
    selectedAddress: PKResult | null;
    dropPin: (shouldDrop: boolean, pkResult?: PKResult) => void;
    panMapTo: (lng: number | undefined, lat: number | undefined) => void;
    panToCurrentLocation: () => void;
    initialiseMap: (mapContainerRef: React.RefObject<HTMLDivElement>) => MutableRefObject<mapboxgl.Map | null>;
    initialiseFaultMap: (faultMapContainerRef: React.RefObject<HTMLDivElement>, faultGeodata: FaultGeoData[]) => MutableRefObject<mapboxgl.Map | null>;
}

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
const MapboxContext = createContext<MapboxContextProps | undefined>(undefined);

const apiKey = String(process.env.NEXT_PUBLIC_PLACEKIT_API_KEY);

const pk = placekit(apiKey);

export const MapboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const map = useRef<Map | null>(null);
    const faultMap = useRef<Map | null>(null);
    let faultMapMarkers: Marker[] = [];

    const faultData: FaultGeoData[] = [];

    const currentMarker = useRef<Marker | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<PKResult | null>(null);

    const initialiseMap = (mapContainerRef: React.RefObject<HTMLDivElement>) => {
        if (map.current) {
            return map;
        }

        //set max bounds to lock the map to South Africa
        const boundsSA: [LngLatLike, LngLatLike] = [
            [16.0, -35.0], // Southwest coordinates (lng, lat)
            [33.0, -22.0]  // Northeast coordinates (lng, lat)
        ];

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            center: [28.23142, -25.75442],
            zoom: 10,
            maxBounds: boundsSA
        });

        return map;
    };

    const panMapTo = (lng: number | undefined, lat: number | undefined) => {
        if (lng && lat) {
            map.current!.easeTo({ center: [lng, lat], zoom: 14, duration: 1000 });
        }
    };

    const panToCurrentLocation = () => {
        if (navigator.geolocation) {
            if (map.current) {

                navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition) => {
                        //pan map to center on user's current location
                        map.current!.easeTo({ center: [position.coords.longitude, position.coords.latitude], zoom: 14, duration: 1000 });

                    },
                    () => {
                        handleLocationError(true);
                    }
                );
            }
        }
        else {
            handleLocationError(false);
        }
    };


    const dropPin = async (shouldDrop: boolean, pkResult?: PKResult) => {
        if (!currentMarker.current) {
            const marker: Marker = new Marker({ anchor: "bottom" })
                .setLngLat(map.current!.getCenter())
            // .setDraggable(true)
            // .addTo(map.current!);

            currentMarker.current = marker;
        }


        if (shouldDrop) {
            currentMarker.current.remove();

            //if pk result is missing, make a request to get address of current location
            if (!pkResult) {
                //place marker on center of map
                currentMarker.current.setLngLat(map.current!.getCenter())
                    .addTo(map.current!);

                const mapCenter = map.current!.getCenter();
                const response = await pk.reverse({
                    coordinates: `${mapCenter.lat},${mapCenter.lng}`,
                    countries: ["za"],
                    maxResults: 1,
                    types: ["street"],
                    language: "en"
                });

                if (response.resultsCount > 0) {
                    console.log(response.results[0]);
                    setSelectedAddress(response.results[0]);
                }
            }

            //otherwise save pkResult
            else {
                //place marker on pkresult coordinates
                if (pkResult.lng && pkResult.lat) {
                    currentMarker.current.setLngLat([pkResult.lng, pkResult.lat])
                        .addTo(map.current!);
                }

                setSelectedAddress(pkResult);
            }
        }
        else {
            //remove marker and address
            currentMarker.current.remove();
            setSelectedAddress(null);
        }
    };

    const initialiseFaultMap = (faultMapContainerRef: React.RefObject<HTMLDivElement>, faultGeodata: FaultGeoData[]) => {
        if (faultMap.current) {
            return faultMap;
        }

        //set max bounds to lock the map to South Africa
        const boundsSA: [LngLatLike, LngLatLike] = [
            [16.0, -35.0], // Southwest coordinates (lng, lat)
            [33.0, -22.0]  // Northeast coordinates (lng, lat)
        ];

        faultMap.current = new mapboxgl.Map({
            container: faultMapContainerRef.current!,
            center: [28.23142, -25.75442],
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


    const createFaultMarker = (color: string) => {
        const faultMarker = document.createElement("div");
        const root = ReactDOM.createRoot(faultMarker);
        if (color == "undefined") {
            root.render(<CustomMarker />);
        }
        else {
            root.render(<CustomMarker fill={color} />);
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

    const handleLocationError = (browserHasGeolocation: boolean) => {
        if (browserHasGeolocation) {
            console.log("The geolocation service failed");
        }
        else {
            console.log("Error: Browser does not support geolocation");
        }
    };


    return (
        <MapboxContext.Provider value={{ map, dropPin, panMapTo, selectedAddress, panToCurrentLocation, initialiseMap, faultMap, initialiseFaultMap }}>
            {children}
        </MapboxContext.Provider>
    );
}

export default MapboxContext;