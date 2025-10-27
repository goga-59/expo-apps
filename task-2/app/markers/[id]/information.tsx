import { Alert, View, Text, ActivityIndicator } from 'react-native';
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

    useEffect(() => {
        (async () => {
            if (!status || status.status !== 'granted') {
                const permission = await requestPermission();
                if (permission.status !== 'granted') {
                    Alert.alert(
                        'Нет доступа к геолокации',
                        'Чтобы отобразить адрес, разрешите использование геолокации в настройках приложения.'
                    );
                }
            }
        })()
    }, [status, requestPermission]);

    useEffect(() => {
        if (!marker) return;

        (async () => {
            try {
                if (status?.status === "granted") {
                    setAddress("Загрузка...")
                    const { latitude, longitude } = JSON.parse(marker.coordinate);

                    const [result] = await Location.reverseGeocodeAsync({ latitude, longitude, });
                    if (result) {
                        setAddress(`${result.formattedAddress}`);
                    }
                }
            } catch (e) {
                console.log('Ошибка при геокодировании:', e);
            }
        })();
    }, [marker, status]);

    const onSaveModal = async (title: string | null, description: string | null) => {
        if (!marker) return;

        try {
            await updateMarker(id, title, description);
        } catch (e) {
            console.error("Failed to update marker: ", e);
            Alert.alert("Ошибка", "Не удалось обновить маркер");
        } finally {
            setIsModalVisible(false);
        }
    }

    if (!success) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!marker) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className='text-lg'>Не удалось получить информацию по маркеру</Text>
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