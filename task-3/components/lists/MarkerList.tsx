import React, { Fragment } from "react";
import { Circle, Marker } from "react-native-maps";
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
                <Fragment key={marker.id}>
                    <Marker
                        image={require('@/assets/images/marker.png')}
                        coordinate={marker.coordinate}
                        onPress={() => router.push({
                            pathname: `/markers/[id]/information`,
                            params: { id: marker.id }
                        })}
                    />
                    <Circle
                        center={marker.coordinate}
                        radius={200}
                        strokeWidth={2}
                        strokeColor="#2E66E7"
                        fillColor="rgba(46, 102, 231, 0.15)"
                    />
                </Fragment>
            ))}
        </>
    )
}