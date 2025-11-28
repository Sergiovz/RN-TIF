import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { NoteService } from '../services/NoteService';

export default function CreateScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const router = useRouter();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para tomar fotos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Falta información', 'Por favor ingresa un título para la nota.');
            return;
        }
        if (!imageUri) {
            Alert.alert('Falta información', 'Por favor agrega una imagen.');
            return;
        }

        try {
            await NoteService.saveNote({
                title,
                description,
                imageUri,
            });
            router.back();
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la nota.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {!imageUri ? (
                    <View style={styles.imageSelector}>
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={56} color={Colors.light.textSecondary} />
                            <Text style={styles.placeholderText}>Selecciona una foto</Text>
                            <Text style={styles.placeholderSubtext}>para tu recuerdo</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.imageButton}
                                onPress={takePhoto}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="camera" size={24} color={Colors.light.primary} />
                                <Text style={styles.buttonText}>Cámara</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.imageButton}
                                onPress={pickImage}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="images" size={24} color={Colors.light.secondary} />
                                <Text style={styles.buttonText}>Galería</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.imagePreviewContainer}>
                        <View style={styles.imagePreview}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                            <View style={styles.imageOverlay} />
                            <TouchableOpacity
                                style={styles.changeImageBtn}
                                onPress={() => setImageUri(null)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="sync" size={18} color="#fff" />
                                <Text style={styles.changeImageText}>Cambiar foto</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageBadge}>
                            <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                            <Text style={styles.imageBadgeText}>Foto seleccionada</Text>
                        </View>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Dale un título a tu recuerdo"
                            placeholderTextColor={Colors.light.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Cuéntanos sobre este momento..."
                            placeholderTextColor={Colors.light.textSecondary}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.saveButtonText}>Guardar Nota</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flexGrow: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    imageSelector: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 20,
        padding: 32,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.border,
        borderStyle: 'dashed',
    },
    imagePlaceholder: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    placeholderSubtext: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.textSecondary,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 12,
        width: '100%',
    },
    imageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.light.primaryLight,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
    },
    imagePreviewContainer: {
        marginBottom: 24,
    },
    imagePreview: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 20,
        overflow: 'hidden',
        height: 320,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    changeImageBtn: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
    },
    changeImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    imageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.successLight,
        borderRadius: 20,
        alignSelf: 'center',
    },
    imageBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.success,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginLeft: 4,
    },
    input: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
    },
    textArea: {
        height: 140,
        paddingTop: 16,
    },
    saveButton: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 12,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});