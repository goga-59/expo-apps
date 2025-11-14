import Map from '@/components/Map';
import { ActivityIndicator, View, Alert } from "react-native";
import { LongPressEvent } from "react-native-maps";
import { useDatabase, useMarkers } from "@/context/DatabaseContext";
import { NewMarker } from "@/database/schema";
import { randomUUID } from 'expo-crypto';

export default function Index() {

    const { success, addMarker } = useDatabase();
    const markers = useMarkers();

    const isLoading = !success || !markers;

    const onLongPress = async (e: LongPressEvent) => {
        try {
            const newMarker: NewMarker = {
                id: randomUUID(),
                coordinate: JSON.stringify(e.nativeEvent.coordinate)
            }
            await addMarker(newMarker);
        } catch (e) {
            console.error("Failed to add marker:", e);
            Alert.alert("Ошибка", "Не удалось добавить маркер");
        }
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View className="flex-1 justify-center">
            <Map markers={markers} onLongPress={onLongPress} />
        </View>
    )
}