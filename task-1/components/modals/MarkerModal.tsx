import { useState } from "react";
import { Modal, Pressable, TextInput, View, Text } from "react-native"

interface MarkerModalProps {
    title: string;
    description: string;
    isVisible: boolean;
    onSave: (title: string, description: string) => void;
    onClose: () => void;
}

export default function MarkerModal({ title: initialTitle, description: initialDescription, isVisible, onSave, onClose }: MarkerModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription)

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType='fade'
            onRequestClose={onClose}
        >
            <View className='flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]'>
                <View className='rounded-[16px] p-6 bg-white w-[90%]'>
                    <Text className='text-xl font-bold mb-4 text-center'>
                        Редактирование маркера
                    </Text>

                    <TextInput
                        className='border border-[#ccc] rounded-[8px] px-3 py-2 mb-4 min-h-[40px]'
                        placeholder='Название'
                        value={title || ""}
                        onChangeText={setTitle}
                        maxLength={20}
                    />

                    <TextInput
                        className='border-[1px] border-[#ccc] rounded-[8px] px-3 py-2 mb-4 min-h-[40px] max-h-[160px]'
                        placeholder='Описание'
                        value={description || ""}
                        onChangeText={setDescription}
                        multiline
                        maxLength={200}
                    />

                    <View className='flex-row justify-between'>
                        <Pressable
                            className='flex p-3 mx-1 py-3 rounded-lg bg-[#007AFF] items-center'
                            onPress={() => onSave(title, description)}
                        >
                            <Text className='text-white font-bold'>Сохранить</Text>
                        </Pressable>

                        <Pressable
                            className='flex p-3 mx-1 py-3 rounded-lg items-center bg-[#ccc]'
                            onPress={onClose}
                        >
                            <Text className='text-black font-bold'>Отмена</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}