import { Alert, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MarkerDetails from '@/components/MarkerDetails';
import ActionButton from '@/components/buttons/ActionButton';
import MarkerModal from '@/components/modals/MarkerModal';
import { useDatabase, useMarkerById } from '@/context/DatabaseContext';
import { NavigationParams } from '@/types';

export default function MarkerInformation() {
    const { id } = useLocalSearchParams<NavigationParams["Information"]>();

    const { success, updateMarker } = useDatabase();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [address, setAddress] = useState('');
    const [status, requestPermission] = Location.useForegroundPermissions();

    const marker = useMarkerById(id);

    const isLoading = !success || !marker;

    useEffect(() => {
        (async () => {
            if (!status?.granted) {
                const permission = await requestPermission();
                if (permission.status !== 'granted') {
                    Alert.alert(
                        'Нет доступа к геолокации',
                        'Чтобы отобразить адрес, разрешите использование геолокации в настройках приложения.'
                    );
                }
            }
        })()
    }, [requestPermission, status?.granted]);

    useEffect(() => {
        if (isLoading || status?.status !== 'granted') {
            setAddress('Не удалось получить адрес :(');
            return;
        }

        (async () => {
            try {
                setAddress("Загрузка...")
                const { latitude, longitude } = JSON.parse(marker.coordinate);

                const [result] = await Location.reverseGeocodeAsync({ latitude, longitude, });
                setAddress(`${result?.formattedAddress || "Не удалось получить адрес :("}`);
            } catch (e) {
                console.log('Ошибка при геокодировании:', e);
                setAddress('Не удалось получить адрес');
            }
        })();
    }, [marker, status, isLoading]);

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

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View className="flex-1 items-center bg-white">
            <MarkerDetails marker={marker} address={address} />

            <ActionButton iconName='create-outline' iconFamily='Ionicons' onPress={() => setIsModalVisible(true)} />

            {marker &&
                <MarkerModal
                    title={marker.title}
                    description={marker.description}
                    isVisible={isModalVisible}
                    onSave={onSaveModal}
                    onClose={() => setIsModalVisible(false)}
                />}
        </View>
    );
}