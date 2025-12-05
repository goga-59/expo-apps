import MapView, { LatLng, LongPressEvent, Marker, Region } from "react-native-maps";
import MarkerList from "./lists/MarkerList";
import { MarkerSelect } from "@/database/schema";

type MapProps = {
    markers: MarkerSelect[] | null;
    userLocation: LatLng | null;
    onLongPress: (e: LongPressEvent) => void;
}

export default function Map({ markers, userLocation, onLongPress }: MapProps) {
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
            {userLocation && <Marker coordinate={userLocation} image={require('@/assets/images/user-location.png')}></Marker>}
            <MarkerList markers={markers} />
        </MapView>
    );
}