import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';

const MyEventsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Registered');
    const { events, getMyRegisteredEvents, getMyInterestedEvents, loading } = useEvents();
    const { currentUser } = useUser();

    const registeredEvents = currentUser ? getMyRegisteredEvents(currentUser.id) : [];
    const interestedEvents = currentUser ? getMyInterestedEvents(currentUser.id) : [];

    // Get full event details
    const getEventDetails = (registration) => {
        return events.find(e => e.id === registration.eventId);
    };

    const filteredData = activeTab === 'Registered' ? registeredEvents : interestedEvents;

    const renderItem = ({ item }) => {
        const event = getEventDetails(item);
        if (!event) return null;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
                {event.image && <Image source={{ uri: event.image }} style={styles.cardImage} />}
                <View style={styles.cardContent}>
                    <View style={[styles.statusBadge, { backgroundColor: activeTab === 'Registered' ? '#4CAF50' : '#FF9800' }]}>
                        <Text style={styles.statusText}>{activeTab}</Text>
                    </View>
                    <Text style={styles.title}>{event.title}</Text>

                    <View style={styles.infoRow}>
                        <Calendar size={16} color="#666" />
                        <Text style={styles.infoText}>{event.date}</Text>
                    </View>

                    {event.time && (
                        <View style={styles.infoRow}>
                            <Clock size={16} color="#666" />
                            <Text style={styles.infoText}>{event.time}</Text>
                        </View>
                    )}

                    {event.venue && (
                        <View style={styles.infoRow}>
                            <MapPin size={16} color="#666" />
                            <Text style={styles.infoText}>{event.venue}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Registered' && styles.activeTab]}
                    onPress={() => setActiveTab('Registered')}
                >
                    <Text style={[styles.tabText, activeTab === 'Registered' && styles.activeTabText]}>
                        Registered ({registeredEvents.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Interested' && styles.activeTab]}
                    onPress={() => setActiveTab('Interested')}
                >
                    <Text style={[styles.tabText, activeTab === 'Interested' && styles.activeTabText]}>
                        Interested ({interestedEvents.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.eventId}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No {activeTab.toLowerCase()} events found.
                        </Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('EventsTab')}
                        >
                            <Text style={styles.browseButtonText}>Browse Events</Text>
                        </TouchableOpacity>
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
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#e3f2fd',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
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
        height: 120,
    },
    cardContent: {
        padding: 16,
    },
    statusBadge: {
        position: 'absolute',
        top: -110,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
        textAlign: 'center',
    },
    browseButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    browseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MyEventsScreen;
