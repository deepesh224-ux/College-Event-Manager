import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Calendar, MapPin, Clock } from 'lucide-react-native';

// Mock data for registered events (subset of main events)
const MOCK_MY_EVENTS = [
    {
        id: '1',
        title: 'Tech Symposium 2024',
        date: '2024-03-15',
        time: '10:00 AM',
        venue: 'Main Auditorium',
        type: 'Technical',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        status: 'Registered',
    },
    {
        id: '3',
        title: 'Inter-College Cricket Tournament',
        date: '2024-03-25',
        time: '8:00 AM',
        venue: 'College Ground',
        type: 'Sports',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000',
        status: 'Interested',
    },
];

const MyEventsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Registered');

    const filteredEvents = MOCK_MY_EVENTS.filter(event =>
        activeTab === 'Registered' ? event.status === 'Registered' : event.status === 'Interested'
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                // In a real app, we would navigate to details. 
                // For now, we just show the card.
                // navigation.navigate('EventDetails', { event: item });
            }}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Registered' ? '#4CAF50' : '#FF9800' }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
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
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Registered' && styles.activeTab]}
                    onPress={() => setActiveTab('Registered')}
                >
                    <Text style={[styles.tabText, activeTab === 'Registered' && styles.activeTabText]}>Registered</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Interested' && styles.activeTab]}
                    onPress={() => setActiveTab('Interested')}
                >
                    <Text style={[styles.tabText, activeTab === 'Interested' && styles.activeTabText]}>Interested</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredEvents}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No events found.</Text>
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
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default MyEventsScreen;
