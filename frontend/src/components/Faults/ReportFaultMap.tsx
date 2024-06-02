import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import useRunOnce from '@/hooks/useRunOnce';


interface ReportFaultMapProps extends React.HTMLAttributes<HTMLElement> {

}


export default function ReportFaultMap({ className }: ReportFaultMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    let map;

    const loadMap = () => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
        });



        loader.importLibrary("maps").then(async () => {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            map = new Map(mapRef.current!, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                disableDefaultUI: true

            });
        });
    };


    useRunOnce({
        fn: () => {
            console.log("Runs once per session");
            // loadMap();
        },
        // Session storage key ensures that the callback only runs once per session.
        // sessionKey: "changeMeAndFnWillRerun"
    });

    return (
        <div className={cn("relative", className)}>
            <MapPin className="absolute top-[50%] left-[50%] z-[9999] text-red-600" size={30} />
            <div className="w-full h-full relative" ref={mapRef}>
            </div>
        </div>
    );
}
