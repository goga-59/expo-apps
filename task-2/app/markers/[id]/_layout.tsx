import { Tabs, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/components/buttons/BackButton';
import DeleteMarkerButton from '@/components/buttons/DeleteMarkerButton';
import { NavigationParams } from '@/types';

export default function MarkerTabsLayout() {
    const { id } = useLocalSearchParams<NavigationParams["MatkerId"]>();

    return (
        <Tabs
            screenOptions={{
                headerTitle: '',
                headerShown: true,
                tabBarActiveTintColor: "#007AFF",
                headerLeft: () => (
                    <BackButton />
                ),
                headerRight: () => (
                    <DeleteMarkerButton markerId={id} />
                )
            }}
        >
            <Tabs.Screen
                name="information"
                options={{
                    title: "Информация",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={24} color={color} />
                    ),
                }}
                initialParams={{ id: id }}
            />

            <Tabs.Screen
                name="photos"
                options={{
                    title: "Галерея",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "images" : "images-outline"} size={24} color={color} />
                    ),
                }}
                initialParams={{ id: id }}
            />
        </Tabs>
    );
}