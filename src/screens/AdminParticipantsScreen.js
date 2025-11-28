import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { User, Hash, BookOpen } from 'lucide-react-native';

const MOCK_PARTICIPANTS = [
    { id: '1', name: 'Alice Johnson', rollNo: 'CS21001', branch: 'CSE', year: '3rd' },
    { id: '2', name: 'Bob Smith', rollNo: 'ME21045', branch: 'ME', year: '3rd' },
    { id: '3', name: 'Charlie Brown', rollNo: 'EC22012', branch: 'ECE', year: '2nd' },
    { id: '4', name: 'David Lee', rollNo: 'CS21056', branch: 'CSE', year: '3rd' },
    { id: '5', name: 'Eva Green', rollNo: 'EE20033', branch: 'EEE', year: '4th' },
];

const AdminParticipantsScreen = ({ route, navigation }) => {
    const { eventTitle } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Participants',
        });
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Hash size={14} color="#666" />
                        <Text style={styles.detailText}>{item.rollNo}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <BookOpen size={14} color="#666" />
                        <Text style={styles.detailText}>{item.branch} - {item.year} Year</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{eventTitle}</Text>
                <Text style={styles.headerSubtitle}>Total Registrations: {MOCK_PARTICIPANTS.length}</Text>
            </View>

            <FlatList
                data={MOCK_PARTICIPANTS}
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666',
    },
});

export default AdminParticipantsScreen;
