import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import MapPin from '../../../public/mapPin.svg';
import { PlaceKit, PlaceKitOptions } from '@placekit/autocomplete-react';
import { PKResult } from '@placekit/client-js';

import '@placekit/autocomplete-js/dist/placekit-autocomplete.css';
import { MapboxContextProps } from '@/context/MapboxContext';
import { Locate, Pin, PinOff } from 'lucide-react';
import { Button } from '@nextui-org/react';

interface Props extends React.HTMLAttributes<HTMLElement> {
    useMapboxProp: () => MapboxContextProps;
}


export default function CreateTicketMap({ className, useMapboxProp }: Props) {
    const [isPinDropped, setIsPinDropped] = useState(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const { map, initialiseMap, dropPin, panMapTo, panToCurrentLocation } = useMapboxProp();

    const memoizedApiKey = useMemo(() => String(process.env.PLACEKIT_API_KEY), [String(process.env.PLACEKIT_API_KEY)]);
    // const memoizedApiKey = "";

    const pkaOptions: PlaceKitOptions = {
        countries: ["za"],
        countryAutoFill: false,
        countrySelect: false,
        timeout: 5000,
        maxResults: 5,
        types: ["street"],
        language: "en",
    };


    const handleSuggestionPick = useCallback(
        (value: string, item: PKResult, index: number) => {
            console.log(item);

            setIsPinDropped(true);
            dropPin(true, item);
            panMapTo(item.lng, item.lat);
        },
        []
    );



    const loadMap = () => {
        if (!map.current && mapContainer.current) {
            initialiseMap(mapContainer);
        }
    };


    const onPinClick = () => {

        if (!isPinDropped) {
            setIsPinDropped(true);
            dropPin(true);
        }
        else {
            setIsPinDropped(false);
            dropPin(false);
        }
    };

    useEffect(() => {
        loadMap();
    }, [initialiseMap]);


    return (
        <div className={cn("relative", className)}>

            <div className="absolute flex flex-col gap-y-5 bottom-10 right-5 z-30">
                <Button className="min-w-fit h-fit p-2 bg-white" onClick={panToCurrentLocation}>
                    <Locate size={21} />
                </Button>

                {!isPinDropped && (
                    <Button className="min-w-fit h-fit p-2 bg-white"  onClick={onPinClick}>
                        <Pin size={21} />
                    </Button>
                )}

                {isPinDropped && (
                    <Button  className="min-w-fit h-fit p-2 bg-white" onClick={onPinClick}>
                        <PinOff size={21} />
                    </Button>
                )}
            </div>

            <div className="absolute top-5 left-5 z-30 w-72">

                <PlaceKit apiKey={memoizedApiKey} options={pkaOptions} className="w-full" onPick={handleSuggestionPick} placeholder="Search for an address..." />

            </div>

            {!isPinDropped && (
                <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-138%] z-40 text-blue-800">
                    <MapPin fill="#BE0505" />
                </div>
            )
            }

            <div className="w-full h-full relative" ref={mapContainer}></div>
        </div>
    );
}
