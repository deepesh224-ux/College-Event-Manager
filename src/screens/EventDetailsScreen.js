import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, MapPin, Clock, User, Phone } from 'lucide-react-native';

const EventDetailsScreen = ({ route, navigation }) => {
    const { event } = route.params;
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = () => {
        if (event.registeredCount >= event.capacity) {
            Alert.alert('Event Full', 'Sorry, this event is already full.');
            return;
        }

        setIsRegistered(!isRegistered);
        Alert.alert(
            isRegistered ? 'Unregistered' : 'Success',
            isRegistered ? 'You have unregistered from this event.' : 'You have successfully registered for this event!'
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: event.image }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{event.title}</Text>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{event.type}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <Calendar size={20} color="#666" />
                        <Text style={styles.infoText}>{event.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Clock size={20} color="#666" />
                        <Text style={styles.infoText}>{event.time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MapPin size={20} color="#666" />
                        <Text style={styles.infoText}>{event.venue}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Event</Text>
                    <Text style={styles.description}>{event.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Person</Text>
                    <View style={styles.infoRow}>
                        <User size={20} color="#666" />
                        <Text style={styles.infoText}>{event.contactPerson}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Phone size={20} color="#666" />
                        <Text style={styles.infoText}>{event.contactNumber}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <View style={styles.capacityContainer}>
                        <Text style={styles.capacityText}>
                            Seats Filled: {event.registeredCount} / {event.capacity}
                        </Text>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }
                                ]}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.registerButton,
                        isRegistered && styles.registeredButton,
                        event.registeredCount >= event.capacity && !isRegistered && styles.disabledButton
                    ]}
                    onPress={handleRegister}
                    disabled={event.registeredCount >= event.capacity && !isRegistered}
                >
                    <Text style={styles.registerButtonText}>
                        {isRegistered ? 'Registered' : event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        color: '#333',
    },
    typeBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    typeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#555',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    capacityContainer: {
        marginTop: 8,
    },
    capacityText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    registerButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    registeredButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EventDetailsScreen;
