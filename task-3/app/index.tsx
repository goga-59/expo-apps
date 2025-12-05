import Map from '@/components/Map';
import { View, Alert } from "react-native";
import { LongPressEvent } from "react-native-maps";
import { useDatabase } from "@/context/DatabaseContext";
import { MarkerInsert } from "@/database/schema";
import { randomUUID } from 'expo-crypto';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export default function Index() {
    const { getMarkers, addMarker } = useDatabase();
    const { data: markers } = useLiveQuery(getMarkers());

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
            <Map markers={markers} onLongPress={onLongPress} />
        </View>
    )
}