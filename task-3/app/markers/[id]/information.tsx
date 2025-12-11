import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import MarkerDetails from '@/components/MarkerDetails';
import ActionButton from '@/components/buttons/ActionButton';
import MarkerModal from '@/components/modals/MarkerModal';
import { useDatabase } from '@/context/DatabaseContext';
import { NavigationParams } from '@/types';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { locationManager } from '@/services/location';

export default function MarkerInformation() {
    const { id } = useLocalSearchParams<NavigationParams["Information"]>();

    const { getMarkerById, updateMarker } = useDatabase();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data } = useLiveQuery(getMarkerById(id));
    const marker = data?.[0];

    useEffect(() => {
        if (!marker || marker.formattedAddress)
            return;

        (async () => {
            locationManager.getFormattedAddress(marker.coordinate)
                .then(async (result: string | null) => {
                    if (result)
                        await updateMarker(id, null, null, result);
                })
                .catch((e) => { console.log('Reverse geocode error:', e); })
        })();
    }, [id, marker, updateMarker]);

    const onSaveModal = async (title: string | null, description: string | null) => {
        try {
            await updateMarker(id, title, description);
        } catch (e) {
            console.error("Failed to update marker: ", e);
            Alert.alert("Ошибка", "Не удалось обновить маркер");
        } finally {
            setIsModalVisible(false);
        }
    }

    return (
        <View className="flex-1 items-center bg-white">
            <MarkerDetails marker={marker} />

            <ActionButton iconName='create-outline' iconFamily='Ionicons' onPress={() => setIsModalVisible(true)} />

            <MarkerModal
                title={marker?.title}
                description={marker?.description}
                isVisible={isModalVisible}
                onSave={onSaveModal}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    );
}