import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";

export default function NotFoundScreen() {
    const router = useRouter()

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="font-bold text-xl">Страница не найдена</Text>
            <Text className="text-lg color-[#666] text-center">Похоже, вы перешли по неверному адресу.</Text>

            <Link href="/" className="color-[#007AFF] text-lg" onPress={() => router.dismissTo("/")}>
                Вернуться на главную
            </Link>
        </View>
    );
}