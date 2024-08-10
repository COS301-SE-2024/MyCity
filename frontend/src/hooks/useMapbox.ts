import MapboxContext, { MapboxContextProps } from "@/context/MapboxContext";
import { useContext } from "react";

export const useMapbox = (): MapboxContextProps => {
    const context = useContext(MapboxContext);
    if (!context) {
        throw new Error("useMapbox must be used within a MapboxProvider");
    }
    return context;
};