import React, { useCallback, useState } from "react";
import Map from '@/components/Map';
import { View, Text, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { MarkerData } from "@/types";
import { addMarker, getMarkers } from "@/utils/storage";
import { LongPressEvent } from "react-native-maps";
import { randomUUID } from "expo-crypto";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function Index() {
    const [markers, setMarkers] = useState<MarkerData[] | null>([])

    useFocusEffect(
        useCallback(() => {
            const fetchMarkers = async () => {
                try {
                    const savedMarkers = await getMarkers();
                    setMarkers(savedMarkers);
                } catch (e) {
                    console.error("Failed to get markers: ", e);
                    setMarkers(null);
                }
            }

            fetchMarkers();
        }, [])
    );

    const onLongPress = async (e: LongPressEvent) => {
        if (!markers) return;

        try {
            const newMarker: MarkerData = {
                coordinate: e.nativeEvent.coordinate,
                id: randomUUID(),
                title: "",
                description: "",
                photos: [],
            }
            await addMarker(newMarker)
            setMarkers([...markers, newMarker])
        } catch (e) {
            console.error("Failed to add marker: ", e);
            Alert.alert("Ошибка", "Не удалось добавить маркер")
        }
    }

    if (!markers) {
        return (
            <View className='flex-1 justify-center items-center m-5'>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={100} color="black" />
                <Text className='text-xl mt-5 text-center'>Не удалось получить маркеры для карты</Text>
            </View>
        )
    }

    return (
        <View className="flex-1">
            <Map markers={markers} onLongPress={onLongPress} />
        </View>
    );
}