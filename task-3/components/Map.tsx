import MapView, { LongPressEvent, Region } from "react-native-maps";
import MarkerList from "./lists/MarkerList";
import { MarkerSelect } from "@/database/schema";

type MapProps = {
    markers: MarkerSelect[] | null;
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
            toolbarEnabled={false}
            moveOnMarkerPress={false}
        >
            <MarkerList markers={markers} />
        </MapView>
    );
}