import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';
import { isToday, formatDate } from '../utils/dateUtils';

const MyDayScreen = () => {
    const { events, getMyRegisteredEvents, getMyInterestedEvents, loading } = useEvents();
    const { currentUser } = useUser();

    // Get user's events
    const myRegistrations = currentUser ? getMyRegisteredEvents(currentUser.id) : [];
    const myInterests = currentUser ? getMyInterestedEvents(currentUser.id) : [];

    // Combine and get full event details for today
    const todayEvents = [...myRegistrations, ...myInterests]
        .map(item => {
            const event = events.find(e => e.id === item.eventId);
            if (!event || !isToday(event.date)) return null;

            return {
                ...event,
                status: myRegistrations.some(r => r.eventId === event.id) ? 'Registered' : 'Interested',
            };
        })
        .filter(Boolean)
        .sort((a, b) => {
            // Sort by time if available
            if (a.time && b.time) {
                return a.time.localeCompare(b.time);
            }
            return 0;
        });

    const renderItem = ({ item, index }) => {
        const color = item.status === 'Registered' ? '#4CAF50' : '#FF9800';

        return (
            <View style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{item.time || 'TBA'}</Text>
                    <View style={[styles.line, { display: index === todayEvents.length - 1 ? 'none' : 'flex' }]} />
                </View>

                <View style={[styles.card, { borderLeftColor: color }]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={[styles.badge, { backgroundColor: color }]}>
                            <Text style={styles.badgeText}>{item.type || 'Event'}</Text>
                        </View>
                    </View>

                    {item.time && item.endTime && (
                        <View style={styles.infoRow}>
                            <Clock size={14} color="#666" />
                            <Text style={styles.infoText}>{item.time} - {item.endTime}</Text>
                        </View>
                    )}

                    {item.venue && (
                        <View style={styles.infoRow}>
                            <MapPin size={14} color="#666" />
                            <Text style={styles.infoText}>{item.venue}</Text>
                        </View>
                    )}

                    <Text style={[styles.statusText, { color }]}>
                        • {item.status}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const today = new Date();
    const dateText = formatDate(today.toISOString()) || today.toLocaleDateString();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateText}>{dateText}</Text>
                <Text style={styles.subText}>Your Schedule</Text>
            </View>

            <FlatList
                data={todayEvents}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No events scheduled for today</Text>
                        <Text style={styles.emptySubText}>
                            Events you register for or mark as interested will appear here
                        </Text>
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
    header: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 20,
        flexGrow: 1,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeContainer: {
        width: 70,
        alignItems: 'center',
        marginRight: 10,
    },
    timeText: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        fontSize: 12,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: '#ddd',
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        marginLeft: 6,
        color: '#666',
        fontSize: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
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
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default MyDayScreen;
