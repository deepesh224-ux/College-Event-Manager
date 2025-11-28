import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, Users } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';

const AdminEventListScreen = ({ navigation }) => {
    const { events, cancelEvent, loading } = useEvents();

    const handleDelete = (id, title) => {
        Alert.alert(
            'Cancel Event',
            `Are you sure you want to cancel "${title}"?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel Event',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await cancelEvent(id);
                        if (result.success) {
                            Alert.alert('Success', 'Event cancelled successfully');
                        } else {
                            Alert.alert('Error', 'Failed to cancel event');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
            <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('AdminEventForm', { eventId: item.id })}
                        >
                            <Edit size={20} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => handleDelete(item.id, item.title)}
                        >
                            <Trash2 size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                {item.status === 'cancelled' && (
                    <View style={styles.cancelledBadge}>
                        <Text style={styles.cancelledText}>CANCELLED</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>

                {item.time && (
                    <View style={styles.infoRow}>
                        <Clock size={16} color="#666" />
                        <Text style={styles.infoText}>{item.time}</Text>
                    </View>
                )}

                {item.venue && (
                    <View style={styles.infoRow}>
                        <MapPin size={16} color="#666" />
                        <Text style={styles.infoText}>{item.venue}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.participantsButton}
                    onPress={() => navigation.navigate('AdminParticipants', { eventId: item.id })}
                >
                    <Users size={16} color="#007AFF" />
                    <Text style={styles.participantsText}>
                        View Participants ({item.capacity - (item.remainingSeats || 0)}/{item.capacity || 0})
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No events created yet</Text>
                        <Text style={styles.emptySubText}>Tap the + button to create your first event</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AdminEventForm')}
            >
                <Plus size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
        flexGrow: 1,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 4,
        marginLeft: 8,
    },
    cancelledBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    cancelledText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    participantsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 8,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
    },
    participantsText: {
        marginLeft: 8,
        color: '#007AFF',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default AdminEventListScreen;
