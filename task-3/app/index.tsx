import Map from '@/components/Map';
import { View, Alert } from "react-native";
import { LatLng, LongPressEvent } from "react-native-maps";
import { useDatabase } from "@/context/DatabaseContext";
import { MarkerInsert, MarkerSelect } from "@/database/schema";
import { randomUUID } from 'expo-crypto';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { notificationManager } from '@/services/notification';
import { locationManager } from '@/services/location';

export default function Index() {
    const { getMarkers, addMarker } = useDatabase();
    const { data: markers } = useLiveQuery(getMarkers());

    const [location, setLocation] = useState<LatLng | null>(null);

    const markersRef = useRef<MarkerSelect[]>([]);
    useEffect(() => {
        markersRef.current = markers;
    }, [markers]);

    useEffect(() => {
        (async () => {
            try {
                await Promise.all([
                    notificationManager.requestNotificationPermissions(),
                    locationManager.requestLocationPermissions()
                ]);

                const loc = await locationManager.getCurrentLocation();
                setLocation(loc);

                await locationManager.startLocationUpdates(async (loc) => {
                    if (loc) {
                        setLocation(loc);
                        await locationManager.checkProximity(loc, markersRef.current);
                    }
                })
            } catch (e) {
                console.log(e);
            }
        })();

        return () => {
            locationManager.stopLocationUpdates();
        };
    }, []);

    const onLongPress = async (event: LongPressEvent) => {
        try {
            const newMarker: MarkerInsert = {
                id: randomUUID(),
                coordinate: event.nativeEvent.coordinate
            }
            await addMarker(newMarker);
        } catch (e) {
            console.error("Failed to add marker:", e);
            Alert.alert("Ошибка", "Не удалось добавить маркер");
        }
    }

    return (
        <View className="flex-1 justify-center">
            <Map markers={markers} userLocation={location} onLongPress={onLongPress} />
        </View>
    )
}