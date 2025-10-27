import { Modal, Pressable, View, Image } from "react-native";

interface PhotoModalProps {
    uri: string;
    isModalVisible: boolean;
    onPress: () => void;
}

export default function PhotoModal({ uri, isModalVisible, onPress }: PhotoModalProps) {
    return (
        <Modal visible={isModalVisible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black">
                <Pressable className="w-full h-full justify-center items-center" onPress={onPress} >
                    <Image
                        source={{ uri: uri }}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </Pressable>
            </View>
        </Modal>
    )
}