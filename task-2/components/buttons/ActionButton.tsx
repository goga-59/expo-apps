import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface ActionButtonProps {
    iconName: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
    iconFamily: "Ionicons" | "MaterialIcons"
    backgroundColor?: string;
    onPress: () => void;
}

export default function ActionButton({ iconName, iconFamily, backgroundColor = "#007AFF", onPress }: ActionButtonProps) {
    const Icon = iconFamily === "Ionicons" ? Ionicons : MaterialIcons;

    return (
        <Pressable
            className="absolute bottom-[20px] end-[20px] w-[56px] h-[56px] rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: backgroundColor }}
            onPress={onPress}
        >
            <Icon className='mb-1 ml-1' name={iconName as any} size={26} color="#fff" />
        </Pressable>
    )
}