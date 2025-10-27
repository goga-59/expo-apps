import { useLocalSearchParams } from "expo-router";
import { View, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import ImageList from "@/components/lists/ImageList";
import { addPhoto, getPhotos, removePhoto } from "@/utils/storage";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ActionButton from "@/components/buttons/ActionButton";
import Title from "@/components/Title";
import { PhotoData, NavigationTypes } from "@/types";
import { randomUUID } from "expo-crypto";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PhotoModal from "@/components/modals/PhotoModal";

export default function MarkerPhotos() {
    const { id } = useLocalSearchParams<NavigationTypes["MarkerInformation"]>();

    const [photos, setPhotos] = useState<PhotoData[] | null>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        const fetchPhotos = async () => {
            try {
                const savedPhotos = await getPhotos(id);
                setPhotos(savedPhotos);
            } catch (e) {
                console.error("Failed to get photos: ", e);
                setPhotos(null);
            }
        }

        fetchPhotos();
    }, [id]);

    const pickImageAsync = async () => {
        if (!photos) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (result.canceled) return;

        try {
            const photoData = result.assets[0];
            const newPhoto: PhotoData = {
                id: randomUUID(),
                uri: photoData.uri
            }
            await addPhoto(id, newPhoto);
            const updated = [...photos, newPhoto];
            setPhotos(updated);
        } catch (e) {
            console.error("Failed to add photo: ", e);
            Alert.alert("Ошибка", "Не удалось добавить фотографию");
        }
    };

    const onRemovePhoto = async (photoId: string) => {
        if (!photos) return;

        try {
            await removePhoto(id, photoId);
            const newPhotos = photos.filter(item => item.id !== photoId);
            setPhotos(newPhotos);
        } catch (e) {
            console.error("Failed to remove photo: ", e);
            Alert.alert("Ошибка", "Не удалось удалить фотографию")
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

    if (!photos) {
        return (
            <View className='flex-1 justify-center items-center m-5'>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={100} color="black" />
                <Text className='text-xl mt-5 text-center'>Не удалось получить информацию по маркеру</Text>
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

            {selectedPhoto &&
                <PhotoModal
                    uri={selectedPhoto.uri}
                    isModalVisible={isModalVisible}
                    onPress={() => setIsModalVisible(false)}
                />
            }

        </View>
    );
}