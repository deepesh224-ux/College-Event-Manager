import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Calendar, MapPin, Clock } from 'lucide-react-native';

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'Tech Symposium 2024',
        date: '2024-03-15',
        time: '10:00 AM',
        venue: 'Main Auditorium',
        type: 'Technical',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        description: 'Annual technical symposium featuring keynote speakers from top tech companies, workshops, and project exhibitions.',
        contactPerson: 'John Doe',
        contactNumber: '123-456-7890',
        capacity: 200,
        registeredCount: 150,
    },
    {
        id: '2',
        title: 'Cultural Fest - Aagaz',
        date: '2024-03-20',
        time: '5:00 PM',
        venue: 'Open Air Theatre',
        type: 'Cultural',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        description: 'A night of music, dance, and drama. Come witness the best talent of our college.',
        contactPerson: 'Jane Smith',
        contactNumber: '987-654-3210',
        capacity: 500,
        registeredCount: 500, // Full
    },
    {
        id: '3',
        title: 'Inter-College Cricket Tournament',
        date: '2024-03-25',
        time: '8:00 AM',
        venue: 'College Ground',
        type: 'Sports',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000',
        description: 'Cheer for your team in the inter-college cricket tournament finals.',
        contactPerson: 'Mike Johnson',
        contactNumber: '555-123-4567',
        capacity: 1000,
        registeredCount: 300,
    },
];

const EventListScreen = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('MyEvents')} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>My Events</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>

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

                {item.registeredCount >= item.capacity && (
                    <View style={styles.fullBadge}>
                        <Text style={styles.fullText}>Full</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={MOCK_EVENTS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
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
