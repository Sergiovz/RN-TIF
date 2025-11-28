import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Note, NoteService } from '../../services/NoteService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadNote();
    }, [id]);

    const loadNote = async () => {
        if (!id) return;
        const notes = await NoteService.getNotes();
        const foundNote = notes.find((n) => n.id === id);
        if (foundNote) {
            setNote(foundNote);
        } else {
            router.back();
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Nota',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        if (note) {
                            await NoteService.deleteNote(note.id);
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    if (!note) return <View style={styles.loadingContainer} />;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.imageHeader}>
                    <Image
                        source={{ uri: note.imageUri }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />

                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 8 }]}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.metaInfo}>
                        <Ionicons name="calendar-outline" size={16} color={Colors.light.textSecondary} />
                        <Text style={styles.dateText}>
                            {new Date(note.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>

                    <Text style={styles.title}>{note.title}</Text>

                    {note.description ? (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.descriptionSection}>
                                <Text style={styles.sectionLabel}>Descripción</Text>
                                <Text style={styles.description}>{note.description}</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyDescription}>
                            <Ionicons name="document-text-outline" size={40} color={Colors.light.border} />
                            <Text style={styles.emptyText}>Sin descripción</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.actionBar}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color={Colors.light.danger} />
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/edit/${note.id}`)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 110,
    },
    imageHeader: {
        height: SCREEN_HEIGHT * 0.45,
        width: '100%',
        position: 'relative',
        backgroundColor: Colors.light.border,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 24,
        minHeight: SCREEN_HEIGHT * 0.6,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    dateText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 20,
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 20,
    },
    descriptionSection: {
        gap: 12,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.light.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
        color: Colors.light.text,
        letterSpacing: 0.2,
    },
    emptyDescription: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        fontStyle: 'italic',
        color: Colors.light.textSecondary,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 32,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: '#FEF2F2',
        borderWidth: 1.5,
        borderColor: '#FEE2E2',
    },
    deleteButtonText: {
        color: Colors.light.danger,
        fontSize: 14,
        fontWeight: '700',
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.light.primary,
        paddingVertical: 16,
        borderRadius: 20,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});