import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';

// Mock data - assuming "today" is 2024-03-15
const TODAY_EVENTS = [
    {
        id: '1',
        title: 'Tech Symposium 2024',
        time: '10:00 AM',
        endTime: '12:00 PM',
        venue: 'Main Auditorium',
        type: 'Technical',
        status: 'Registered',
        color: '#2196F3'
    },
    {
        id: '4',
        title: 'Lunch Break',
        time: '12:00 PM',
        endTime: '1:00 PM',
        venue: 'Cafeteria',
        type: 'Break',
        status: 'All',
        color: '#4CAF50'
    },
    {
        id: '5',
        title: 'Workshop: AI in 2024',
        time: '1:30 PM',
        endTime: '3:30 PM',
        venue: 'Lab 3',
        type: 'Technical',
        status: 'Interested',
        color: '#FF9800'
    }
];

const MyDayScreen = () => {
    const renderItem = ({ item, index }) => (
        <View style={styles.timelineItem}>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={[styles.line, { display: index === TODAY_EVENTS.length - 1 ? 'none' : 'flex' }]} />
            </View>

            <View style={[styles.card, { borderLeftColor: item.color }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={[styles.badge, { backgroundColor: item.color }]}>
                        <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.infoText}>{item.time} - {item.endTime}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.infoText}>{item.venue}</Text>
                </View>

                {item.status !== 'All' && (
                    <Text style={[styles.statusText, { color: item.status === 'Registered' ? '#4CAF50' : '#FF9800' }]}>
                        • {item.status}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateText}>March 15, 2024</Text>
                <Text style={styles.subText}>Your Schedule</Text>
            </View>

            <FlatList
                data={TODAY_EVENTS}
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
});

export default MyDayScreen;
