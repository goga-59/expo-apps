import React from "react";
import { MarkerData } from "@/types";
import { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

type MarkerListProps = {
    markers: MarkerData[];
}

export default function MarkerList({ markers }: MarkerListProps) {
    const router = useRouter();

    return (
        <>
            {markers.map((marker) => (
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