'use client'

import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';
import mapboxgl, {Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import placekit, { PKResult } from '@placekit/client-js';
import { FaultGeoData } from '@/types/custom.types';

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

    const currentMarker = useRef<Marker | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<PKResult | null>(null);

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 240;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;

    let userInteracting = false;
    const spinEnabled = true;


    const spinGlobe = (theMap: Map) => {
        const zoom = theMap.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
                // Slow spinning at higher zooms
                const zoomDif =
                    (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            const center = theMap.getCenter();
            center.lng -= distancePerSecond;
            // Smoothly animate the map over one second.
            // When this animation is complete, it calls a 'moveend' event.
            theMap.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    };


    const initialiseMap = (mapContainerRef: React.RefObject<HTMLDivElement>) => {
        if (map.current) {
            return map;
        }

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            // style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [28.23142, -25.75442],
            zoom: 1,
            projection: { name: "globe" }
        });


        map.current.on("style.load", (event) => {
            map.current!.setFog({}); // Set the default atmosphere style
        });

        // Pause spinning on interaction
        map.current.on("mousedown", (event) => {
            userInteracting = true;
        });

        map.current.on("dragstart", () => {
            userInteracting = true;
        });

        // When animation is complete, start spinning if there is no ongoing interaction
        map.current.on("moveend", () => {
            spinGlobe(map.current!);
        });


        spinGlobe(map.current!);


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

        faultMap.current = new mapboxgl.Map({
            container: faultMapContainerRef.current!,
            center: [28.23142, -25.75442],
            zoom: 10
        });


        faultMap.current.on("mousedown", (event) => {
            userInteracting = true;
        });

        faultMap.current.on("dragstart", () => {
            userInteracting = true;
        });


        addFaultMarkers(faultGeodata);

        return faultMap;
    };


    const addFaultMarkers = (faultGeodata: FaultGeoData[]) => {
        if (!faultMap.current) {
            return;
        }

        // add markers to map
        for (const feature of faultGeodata) {
            new mapboxgl.Marker().setLngLat([Number(feature.longitude), Number(feature.latitude)]).addTo(faultMap.current);
        }


        // faultMap.current.on("load", function () {
        //     if (!faultMap.current) {
        //         return;
        //     }

        //     faultMap.current.addSource("faults", {
        //         type: "geojson",
        //         data: geoJSONData,
        //         cluster: true,
        //         clusterMaxZoom: 14, // Max zoom to cluster points on
        //         clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        //     });

        //     faultMap.current.addLayer({
        //         id: "clusters",
        //         type: "circle",
        //         source: "faults",
        //         filter: ["has", "point_count"],
        //         paint: {
        //             "circle-color": [
        //                 "step",
        //                 ["get", "point_count"],
        //                 "#51bbd6",
        //                 100,
        //                 "#f1f075",
        //                 750,
        //                 "#f28cb1"
        //             ],
        //             "circle-radius": [
        //                 "step",
        //                 ["get", "point_count"],
        //                 20,
        //                 100,
        //                 30,
        //                 750,
        //                 40
        //             ]
        //         }
        //     });

        //     faultMap.current.addLayer({
        //         id: "cluster-count",
        //         type: "symbol",
        //         source: "faults",
        //         filter: ["has", "point_count"],
        //         layout: {
        //             "text-field": "{point_count_abbreviated}",
        //             "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        //             "text-size": 12
        //         }
        //     });

        //     faultMap.current.addLayer({
        //         id: "unclustered-point",
        //         type: "circle",
        //         source: "faults",
        //         filter: ["!", ["has", "point_count"]],
        //         paint: {
        //             "circle-color": "#11b4da",
        //             "circle-radius": 4,
        //             "circle-stroke-width": 1,
        //             "circle-stroke-color": "#fff"
        //         }
        //     });
        // });

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