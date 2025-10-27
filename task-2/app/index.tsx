import Map from '@/components/Map';
import { ActivityIndicator, View, Text, Alert } from "react-native";
import { LongPressEvent } from "react-native-maps";
import { randomUUID } from "expo-crypto";
import { useDatabase, useMarkers } from "@/context/DatabaseContext";
import { NewMarker } from "@/database/schema";

export default function Index() {

    const { success, addMarker } = useDatabase();
    const markers = useMarkers();

    const onLongPress = async (e: LongPressEvent) => {
        if (!success || !markers) return;

        try {
            const newMarker: NewMarker = {
                coordinate: JSON.stringify(e.nativeEvent.coordinate),
                id: randomUUID(),
            }
            await addMarker(newMarker);
        } catch (e) {
            console.error("Failed to add marker:", e);
            Alert.alert("Ошибка", "Не удалось добавить маркер");
        }
    }

    if (!success) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!markers) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className='text-lg'>Не удалось получить маркеры</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 justify-center">
            <Map markers={markers} onLongPress={onLongPress} />
        </View>
    )
}