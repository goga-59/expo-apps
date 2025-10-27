import { Alert, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getMarkerById, updateMarker } from '@/utils/storage';
import { MarkerData, NavigationTypes } from "@/types";
import * as Location from 'expo-location';
import MarkerDetails from '@/components/MarkerDetails';
import ActionButton from '@/components/buttons/ActionButton';
import MarkerModal from '@/components/modals/MarkerModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MarkerInformation() {
    const { id } = useLocalSearchParams<NavigationTypes["MarkerPhotos"]>();

    const [marker, setMarker] = useState<MarkerData | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchMarker = async () => {
            try {
                const marker = await getMarkerById(id);
                setMarker(marker);
            } catch (e) {
                console.error("Failed to get marker by id: ", e);
                setMarker(null);
            }
        }

        fetchMarker()
    }, [id]);

    useEffect(() => {
        if (!marker) return;

        const fetchAddress = async () => {
            setAddress("Загрузка...")
            const { latitude, longitude } = marker.coordinate;
            try {
                const [result] = await Location.reverseGeocodeAsync({ latitude, longitude, });
                if (result) {
                    setAddress(`${result.formattedAddress}`);
                }
            } catch (e) {
                console.error('Failed to geocode location:', e);
                setAddress('');
            }
        }

        fetchAddress();
    }, [marker]);

    const onSaveModal = async (title: string, description: string) => {
        if (!marker) return;
        setModalVisible(false);

        try {
            const updated = { ...marker, title: title, description: description }
            await updateMarker(updated);
            setMarker(updated);
        } catch (e) {
            console.error("Failed to update markers: ", e);
            Alert.alert("Ошибка", "Не удалось обновить информацию")
        }
    }

    if (!marker) {
        return (
            <View className='flex-1 justify-center items-center m-5'>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={100} color="black" />
                <Text className='text-xl mt-5 text-center'>Не удалось получить информацию по маркеру</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 items-center bg-white">
            <MarkerDetails marker={marker} address={address} />

            <ActionButton iconName='create-outline' iconFamily='Ionicons' onPress={() => setModalVisible(true)} />

            <MarkerModal
                title={marker.title}
                description={marker.description}
                isVisible={isModalVisible}
                onSave={onSaveModal}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}