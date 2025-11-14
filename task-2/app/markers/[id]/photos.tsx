import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import ImageList from "@/components/lists/ImageList";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ActionButton from "@/components/buttons/ActionButton";
import Title from "@/components/Title";
import { randomUUID } from "expo-crypto";
import { useDatabase, usePhoto } from "@/context/DatabaseContext";
import { NewPhoto, PhotoData } from "@/database/schema";
import { NavigationParams } from "@/types";
import PhotoModal from "@/components/modals/PhotoModal";

export default function MarkerPhotos() {
    const { id } = useLocalSearchParams<NavigationParams["Photo"]>();

    const { success, addPhoto, removePhoto } = useDatabase();
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const photos = usePhoto(id);

    const isLoading = !success || !photos;

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (result.canceled) return

        try {
            const photoData = result.assets[0];
            const newPhoto: NewPhoto = {
                id: randomUUID(),
                uri: photoData.uri,
                markerId: id,
            }
            await addPhoto(newPhoto);
        } catch (e) {
            console.error("Failed to add photo: ", e);
            Alert.alert("Ошибка", "Не удалось добавить фото");
        }
    };

    const onRemovePhoto = async (photoId: string) => {
        try {
            await removePhoto(photoId);
        } catch (e) {
            console.error("Failed to remove photo: ", e);
            Alert.alert("Ошибка", "Не удалось удалить фото");
        }
    };

    const openPhoto = (photo: PhotoData) => {
        setSelectedPhoto(photo);
        setIsModalVisible(true);
    }

    const EmptyGallery = () => (
        <View className="flex-1 justify-center items-center">
            <MaterialIcons name="photo-library" size={64} color="#ccc" />
            <Text className="text-gray-400 text-lg mt-4">Фотографии пока не добавлены</Text>
        </View>
    )

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white items-center">
            <View className="flex-[0.86] rounded-2xl bg-gray-100 shadow-lg w-[95%] mt-4 border border-gray-200">
                <Title text="Галерея" />

                <View className="flex-1">
                    {photos.length === 0 ? (
                        <EmptyGallery />
                    ) : (
                        <ImageList photos={photos} onRemovePhoto={onRemovePhoto} onOpenPhoto={openPhoto} />
                    )}
                </View>
            </View>

            <ActionButton iconName="add-photo-alternate" iconFamily="MaterialIcons" onPress={pickImageAsync} />

            {selectedPhoto && (
                <PhotoModal uri={selectedPhoto.uri} isModalVisible={isModalVisible} onPress={() => setIsModalVisible(false)} />
            )}
        </View>
    );
}