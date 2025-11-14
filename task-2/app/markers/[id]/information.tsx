import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MarkerDetails from '@/components/MarkerDetails';
import ActionButton from '@/components/buttons/ActionButton';
import MarkerModal from '@/components/modals/MarkerModal';
import { useDatabase } from '@/context/DatabaseContext';
import { NavigationParams } from '@/types';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSION_ASKED = 'location_permission_asked';

export default function MarkerInformation() {
    const { id } = useLocalSearchParams<NavigationParams["Information"]>();

    const { getMarkerById, updateMarker } = useDatabase();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [address, setAddress] = useState('');
    const [status, requestPermission] = Location.useForegroundPermissions();

    const { data } = useLiveQuery(getMarkerById(id));
    const marker = data?.[0];

    useEffect(() => {
        if (status?.granted) return;

        (async () => {
            const alreadyAsked = await AsyncStorage.getItem(PERMISSION_ASKED);
            if (alreadyAsked === "true") return

            const permission = await requestPermission();
            await AsyncStorage.setItem(PERMISSION_ASKED, 'true');
            if (permission.status !== 'granted') {
                Alert.alert(
                    'Нет доступа к геолокации',
                    'Чтобы отобразить адрес, разрешите использование геолокации в настройках приложения.'
                );
            }

        })()
    }, [requestPermission, status?.granted]);

    useEffect(() => {
        if (status?.status !== 'granted' || !marker) {
            setAddress('Не удалось получить адрес :(');
            return;
        }

        (async () => {
            try {
                setAddress("Загрузка...")
                const { latitude, longitude } = marker.coordinate;

                const [result] = await Location.reverseGeocodeAsync({ latitude, longitude, });
                setAddress(`${result?.formattedAddress || "Не удалось получить адрес :("}`);
            } catch (e) {
                console.log('Ошибка при геокодировании:', e);
                setAddress('Не удалось получить адрес');
            }
        })();
    }, [marker, status]);

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
            <MarkerDetails marker={marker} address={address} />

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