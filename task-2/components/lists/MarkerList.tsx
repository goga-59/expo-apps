import React from "react";
import { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { MarkerSelect } from "@/database/schema";

type MarkerListProps = {
    markers: MarkerSelect[] | null;
}

export default function MarkerList({ markers }: MarkerListProps) {
    const router = useRouter();

    return (
        <>
            {markers && markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    onPress={() => router.push({
                        pathname: `/markers/[id]/information`,
                        params: { id: marker.id }
                    })}
                >
                </Marker>
            ))}
        </>
    )
}