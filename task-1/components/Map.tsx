import { MarkerData } from "@/types";
import MapView, { LongPressEvent, Region } from "react-native-maps";
import MarkerList from "./lists/MarkerList";

type MapProps = {
    markers: MarkerData[];
    onLongPress: (e: LongPressEvent) => void;
}

export default function Map({ markers, onLongPress }: MapProps) {
    const region: Region = {
        latitude: 58,
        longitude: 56.2,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    }

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            onLongPress={onLongPress}
            loadingEnabled
            toolbarEnabled={false}
        >
            <MarkerList markers={markers} />
        </MapView>
    );
}