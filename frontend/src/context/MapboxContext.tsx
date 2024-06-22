'use client'

import { MutableRefObject, ReactNode, createContext, useContext, useRef } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapboxContextProps {
    map: MutableRefObject<mapboxgl.Map | null>;
    dropPin: () => void;
    panMapTo: (lng: number | undefined, lat: number | undefined) => void;
    panToCurrentLocation: () => void;
    initialiseMap: (mapContainerRef: React.RefObject<HTMLDivElement>) => MutableRefObject<mapboxgl.Map | null>;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const MapboxContext = createContext<MapboxContextProps | undefined>(undefined);


export const MapboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const [map, setMap] = useState<Map | null>(null);
    const map = useRef<Map | null>(null);
    let currentMarker: Marker | null = null;

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
            zoom: 14,
            // projection: { name: "globe" }
        });


        // const marker: Marker = new Marker({ anchor: "bottom" })
        //     .setLngLat([28.23142, -25.75442])
        //     .addTo(map.current!);

        // Set an event listener
        map.current!.on('click', (event) => {
            if (currentMarker) {
                currentMarker.remove();
            }

            const marker: Marker = new Marker({ anchor: "bottom" })
                .setLngLat(event.lngLat)
                .setDraggable(true)
                .addTo(map.current!);

            currentMarker = marker;
        });

        // newMap.on("style.load", (event) => {
        //     newMap.setFog({}); // Set the default atmosphere style
        // });

        // // Pause spinning on interaction
        // newMap.on("mousedown", (event) => {
        //     userInteracting = true;
        //     handleMouseDown(event);
        // });

        // newMap.on("dragstart", () => {
        //     userInteracting = true;
        // });

        // // When animation is complete, start spinning if there is no ongoing interaction
        // newMap.on("moveend", () => {
        //     spinGlobe(newMap);
        // });


        // spinGlobe(newMap);


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


    const dropPin = () => {
        if (currentMarker) {
            currentMarker.remove();
        }

        const marker: Marker = new Marker({ anchor: "bottom" })
            .setLngLat(map.current!.getCenter())
            .setDraggable(true)
            .addTo(map.current!);

        currentMarker = marker;

        // const marker: Marker = new Marker({ anchor: "bottom" })
        //     .setLngLat(map.current!.getCenter())
        //     .setDraggable(true)
        //     .addTo(map.current!);

        // currentMarker = marker;
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
        <MapboxContext.Provider value={{ map, dropPin, panMapTo, panToCurrentLocation, initialiseMap }}>
            {children}
        </MapboxContext.Provider>
    );
}

export const useMapbox = (): MapboxContextProps => {
    const context = useContext(MapboxContext);
    if (!context) {
        throw new Error("useMapbox must be used within a MapboxProvider");
    }
    return context;
};