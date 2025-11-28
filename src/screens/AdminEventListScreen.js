import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, Users } from 'lucide-react-native';

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'Tech Symposium 2024',
        date: '2024-03-15',
        time: '10:00 AM',
        venue: 'Main Auditorium',
        type: 'Technical',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        registeredCount: 150,
        capacity: 200,
    },
    {
        id: '2',
        title: 'Cultural Fest - Aagaz',
        date: '2024-03-20',
        time: '5:00 PM',
        venue: 'Open Air Theatre',
        type: 'Cultural',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        registeredCount: 500,
        capacity: 500,
    },
];

const AdminEventListScreen = ({ navigation }) => {
    const [events, setEvents] = useState(MOCK_EVENTS);

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setEvents(events.filter(e => e.id !== id))
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('AdminEventForm', { event: item })}
                        >
                            <Edit size={20} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => handleDelete(item.id)}
                        >
                            <Trash2 size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.infoText}>{item.time}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.infoText}>{item.venue}</Text>
                </View>

                <TouchableOpacity
                    style={styles.participantsButton}
                    onPress={() => navigation.navigate('AdminParticipants', { eventId: item.id, eventTitle: item.title })}
                >
                    <Users size={16} color="#007AFF" />
                    <Text style={styles.participantsText}>
                        View Participants ({item.registeredCount}/{item.capacity})
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
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
    listContent: {
        padding: 16,
        paddingBottom: 80,
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
