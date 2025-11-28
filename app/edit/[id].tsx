import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Note, NoteService } from '../../services/NoteService';

export default function EditScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [originalNote, setOriginalNote] = useState<Note | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadNote();
    }, [id]);

    const loadNote = async () => {
        if (!id) return;
        const notes = await NoteService.getNotes();
        const foundNote = notes.find((n) => n.id === id);
        if (foundNote) {
            setOriginalNote(foundNote);
            setTitle(foundNote.title);
            setDescription(foundNote.description);
            setImageUri(foundNote.imageUri);
        } else {
            Alert.alert('Error', 'Nota no encontrada', [{ text: 'OK', onPress: () => router.back() }]);
        }
    };

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
            Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara.');
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
            Alert.alert('Falta información', 'Por favor ingresa un título.');
            return;
        }
        if (!imageUri) {
            Alert.alert('Falta información', 'Por favor agrega una imagen.');
            return;
        }
        if (!originalNote) return;

        try {
            await NoteService.updateNote({
                ...originalNote,
                title,
                description,
                imageUri,
                date: new Date().toISOString(),
            });
            router.dismissAll();
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la nota.');
        }
    };

    if (!originalNote) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                {imageUri && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        <View style={styles.imageActions}>
                            <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
                                <Ionicons name="images" size={20} color="#fff" />
                            </TouchableOpacity>
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
                            placeholder="Título de la nota"
                            placeholderTextColor={Colors.light.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Descripción de la nota"
                            placeholderTextColor={Colors.light.textSecondary}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
    imagePreview: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        height: 280,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageActions: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        gap: 10,
    },
    imageActionBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
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