import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function BackButton() {
    const router = useRouter();

    return (
        <Pressable
            className="ml-[15px] p-[7px]"
            onPress={() => {
                router.dismissAll();
            }}>
            <Ionicons name="arrow-back" size={28} color={"black"} />
        </Pressable>
    );
}