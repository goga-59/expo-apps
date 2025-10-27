import { removeMarker } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable } from "react-native";

interface DeleteMarkerButtonProps {
    markerId: string;
}

export default function DeleteMarkerButton({ markerId }: DeleteMarkerButtonProps) {
    const router = useRouter();

    const onPress = () => {
        Alert.alert(
            "Удаление маркера",
            "Вы уверены, что хотите удалить этот маркер?",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Удалить",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeMarker(markerId);
                            router.dismissAll();
                        } catch (e) {
                            console.error("Failed to remove marker: ", e);
                            Alert.alert("Ошибка", "Не удалось удалить маркер");
                        }
                    },
                }
            ]
        )
    }

    return (
        <Pressable onPress={onPress} className="mr-[15px] p-[7px]">
            <Ionicons name="trash" size={24} color="black" />
        </Pressable>
    )
}