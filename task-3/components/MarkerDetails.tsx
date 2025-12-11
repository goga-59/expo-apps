import React from "react";
import { View, Text, ScrollView } from "react-native";
import Title from "./Title";
import { MarkerSelect } from "@/database/schema";

interface MarkerDetailsProps {
    marker: MarkerSelect;
}

export default function MarkerDetails({ marker }: MarkerDetailsProps) {
    return (
        <View className="flex-[0.86] px-4 rounded-2xl bg-gray-100 shadow-lg w-[95%] mt-4 border border-gray-200">
            <Title text={marker?.title || "Ваш новый маркер!"} />

            <View className='w-full h-[55%] mb-3 bg-gray-200 rounded-2xl border border-gray-300'>
                <Text className="text-2xl font-semibold ml-5 mt-4 border-b pb-3 w-[90%]">Описание</Text>
                <ScrollView>
                    <Text className='text-lg text-gray-700 mt-2 ml-5'>
                        {marker?.description || "Здесь будет ваше описание..."}
                    </Text>
                </ScrollView>
            </View>

            <View className="w-full h-[30%] mb-3 bg-gray-200 rounded-2xl border border-gray-300">
                <Text className='text-2xl font-semibold ml-5 mt-4 border-b pb-3 w-[90%]'>Местоположение</Text>
                <ScrollView>
                    <Text className="text-lg text-gray-700 mt-2 ml-5">
                        {marker?.formattedAddress && <Text>{marker.formattedAddress + '\n'}</Text>}
                        <Text>Широта: {marker?.coordinate.latitude.toFixed(3) + '\n'}</Text>
                        <Text>Долгота: {marker?.coordinate.longitude.toFixed(3)}</Text>
                    </Text>
                </ScrollView>
            </View>
        </View>
    )
}