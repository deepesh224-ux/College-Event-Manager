import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';

const EventListScreen = ({ navigation }) => {
    const { events, loading } = useEvents();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('MyEventsTab')} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>My Events</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        >
            {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
            <View style={styles.cardContent}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type || 'Event'}</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>

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

                {item.remainingSeats !== undefined && item.remainingSeats <= 0 && (
                    <View style={styles.fullBadge}>
                        <Text style={styles.fullText}>Full</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading events...</Text>
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
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>No events available</Text>
                    </View>
                }
            />
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
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    listContent: {
        padding: 16,
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
    typeBadge: {
        position: 'absolute',
        top: -140,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
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
    fullBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#ff4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    fullText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerButton: {
        marginRight: 8,
    },
    headerButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});

export default EventListScreen;
