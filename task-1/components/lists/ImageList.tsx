import { PhotoData } from "@/types";
import { FlatList, Image, Dimensions, View, Alert, Pressable } from "react-native";

type ImageListProps = {
    photos: PhotoData[];
    numColumns?: number;
    onRemovePhoto: (uri: string) => void;
    onOpenPhoto: (photo: PhotoData) => void;
}

export default function ImageList({ photos, numColumns = 3, onRemovePhoto, onOpenPhoto }: ImageListProps) {
    const screenWidth = Dimensions.get("window").width * 0.95;
    const gap = 7;
    const totalGap = gap * (numColumns + 1);
    const imageSize = (screenWidth - totalGap) / numColumns;

    const onLongPress = (id: string) => {
        Alert.alert(
            "Удалить фото",
            "Вы уверены, что хотите удалить это фото?",
            [
                { text: "Отмена", style: "cancel" },
                { text: "Удалить", style: "destructive", onPress: () => onRemovePhoto(id) }
            ]
        )
    }

    return (
        <FlatList
            data={photos}
            numColumns={numColumns}
            contentContainerStyle={{
                paddingHorizontal: gap,
                paddingBottom: gap
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View className="m-[2px] rounded-[10px]" style={{ width: imageSize, height: imageSize }}>
                    <Pressable onLongPress={() => onLongPress(item.id)} onPress={() => onOpenPhoto(item)}>
                        <Image
                            source={{ uri: item.uri }}
                            className="rounded-lg"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Pressable>
                </View>
            )}
        />
    )
}