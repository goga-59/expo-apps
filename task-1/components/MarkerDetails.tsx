import { MarkerData } from "@/types";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import Title from "./Title";

interface MarkerDetailsProps {
    marker: MarkerData;
    address: string;
}

export default function MarkerDetails({ marker, address }: MarkerDetailsProps) {
    return (
        <View className="flex-[0.86] px-4 rounded-2xl bg-gray-100 shadow-lg w-[95%] mt-4 border border-gray-200">
            <Title text={marker.title || "Ваш новый маркер!"} />

            <View className='w-full h-[55%] mb-3 bg-gray-200 rounded-2xl border border-gray-300'>
                <Text className="text-2xl font-semibold ml-5 mt-4 border-b pb-3 w-[90%]">Описание</Text>
                <ScrollView>
                    <Text className='text-lg text-gray-700 mt-2 ml-5'>
                        {marker.description || "Здесь будет ваше описание..."}
                    </Text>
                </ScrollView>
            </View>

            <View className="w-full h-[30%] mb-3 bg-gray-200 rounded-2xl border border-gray-300">
                <Text className='text-2xl font-semibold ml-5 mt-4 border-b pb-3 w-[90%]'>Местоположение</Text>
                <ScrollView>
                    <Text className="text-lg text-gray-700 mt-2 ml-5">
                        {address || "Не удалось получить адрес :("}
                        {"\n"}Широта: {marker.coordinate.latitude.toFixed(3)}
                        {"\n"}Долгота: {marker.coordinate.longitude.toFixed(3)}
                    </Text>
                </ScrollView>
            </View>
        </View>
    )
}