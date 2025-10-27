import { View, Text } from "react-native";

interface TitleProps {
    text: string;
}

export default function Title({ text }: TitleProps) {
    return (
        <View className="items-center mb-2 justify-center">
            <Text className="text-3xl my-2 font-bold text-center" numberOfLines={1} ellipsizeMode='tail'>
                {text}
            </Text>
        </View>
    )
}