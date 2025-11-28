import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { User, Hash, BookOpen } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';

const AdminParticipantsScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const { getEventById, getParticipants, loading } = useEvents();

    const event = getEventById(eventId);
    const participants = getParticipants(eventId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Participants',
        });
    }, [navigation]);

    const renderItem = ({ item }) => {
        const student = item.student;

        return (
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{student.name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{student.name || 'Unknown'}</Text>
                    <View style={styles.detailsRow}>
                        {student.rollNumber && (
                            <View style={styles.detailItem}>
                                <Hash size={14} color="#666" />
                                <Text style={styles.detailText}>{student.rollNumber}</Text>
                            </View>
                        )}
                        {student.branch && (
                            <View style={styles.detailItem}>
                                <BookOpen size={14} color="#666" />
                                <Text style={styles.detailText}>
                                    {student.branch}{student.year ? ` - ${student.year}${getYearSuffix(student.year)} Year` : ''}
                                </Text>
                            </View>
                        )}
                        {student.email && (
                            <View style={styles.detailItem}>
                                <User size={14} color="#666" />
                                <Text style={styles.detailText}>{student.email}</Text>
                            </View>
                        )}
                    </View>
                    {item.registeredAt && (
                        <Text style={styles.registeredTime}>
                            Registered: {new Date(item.registeredAt).toLocaleDateString()}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const getYearSuffix = (year) => {
        if (year === 1) return 'st';
        if (year === 2) return 'nd';
        if (year === 3) return 'rd';
        return 'th';
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Event not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{event.title}</Text>
                <Text style={styles.headerSubtitle}>Total Registrations: {participants.length}</Text>
                {event.capacity && (
                    <Text style={styles.headerSubtitle}>
                        Capacity: {participants.length}/{event.capacity}
                    </Text>
                )}
            </View>

            <FlatList
                data={participants}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.student.id || index.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No participants yet</Text>
                        <Text style={styles.emptySubText}>
                            Participants will appear here once they register
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
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'column',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666',
    },
    registeredTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
        fontStyle: 'italic',
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
});

export default AdminParticipantsScreen;
