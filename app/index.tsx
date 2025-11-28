import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { Note, NoteService } from '../services/NoteService';

export default function HomeScreen() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const loadNotes = async () => {
        const data = await NoteService.getNotes();
        setNotes(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotes();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Note }) => (
        <Link href={`/note/${item.id}`} asChild>
            <TouchableOpacity activeOpacity={0.95} style={styles.card}>
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={12} color="#fff" />
                        <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    {item.description && (
                        <Text style={styles.cardDescription} numberOfLines={1}>{item.description}</Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.row}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="image-outline" size={64} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.emptyText}>Sin recuerdos aún</Text>
                        <Text style={styles.emptySubText}>Captura tus momentos favoritos</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/create')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    listContent: {
        padding: 12,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    card: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
        height: 240,
        flex: 1,
        maxWidth: '48%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        paddingBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    cardDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '400',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 120,
        width: '100%',
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.light.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.light.text,
        marginTop: 8,
    },
    emptySubText: {
        fontSize: 15,
        color: Colors.light.textSecondary,
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        backgroundColor: Colors.light.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
});