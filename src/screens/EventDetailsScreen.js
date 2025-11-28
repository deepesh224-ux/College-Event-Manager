import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Calendar, MapPin, Clock, User, Phone } from 'lucide-react-native';
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';

const EventDetailsScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const { getEventById, registerForEvent, unregisterFromEvent, markInterested, removeInterest, registrations, interested } = useEvents();
    const { currentUser } = useUser();

    const event = getEventById(eventId);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isInterested, setIsInterested] = useState(false);

    useEffect(() => {
        if (currentUser && event) {
            // Check if user is registered
            const registered = registrations.some(
                r => r.eventId === eventId && r.student.id === currentUser.id
            );
            setIsRegistered(registered);

            // Check if user is interested
            const interestedStatus = interested.some(
                i => i.eventId === eventId && i.student.id === currentUser.id
            );
            setIsInterested(interestedStatus);
        }
    }, [currentUser, event, eventId, registrations, interested]);

    if (!event) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Event not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleRegister = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'Please sign in to register');
            return;
        }

        if (isRegistered) {
            // Unregister
            const result = await unregisterFromEvent(eventId, currentUser.id);
            if (result.success) {
                setIsRegistered(false);
                Alert.alert('Success', 'You have unregistered from this event');
            }
        } else {
            // Register
            if (event.remainingSeats <= 0) {
                Alert.alert('Event Full', 'Sorry, this event is already full.');
                return;
            }

            const result = await registerForEvent(eventId, currentUser);
            if (result.success) {
                setIsRegistered(true);
                Alert.alert('Success', 'You have successfully registered for this event!');
            } else {
                Alert.alert('Error', result.message || 'Failed to register');
            }
        }
    };

    const handleInterest = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'Please sign in to mark interest');
            return;
        }

        if (isInterested) {
            const result = await removeInterest(eventId, currentUser.id);
            if (result.success) {
                setIsInterested(false);
            }
        } else {
            const result = await markInterested(eventId, currentUser);
            if (result.success) {
                setIsInterested(true);
                Alert.alert('Success', 'Marked as interested!');
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            {event.image && <Image source={{ uri: event.image }} style={styles.image} />}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{event.title}</Text>
                    {event.type && (
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{event.type}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <Calendar size={20} color="#666" />
                        <Text style={styles.infoText}>{event.date}</Text>
                    </View>
                    {event.time && (
                        <View style={styles.infoRow}>
                            <Clock size={20} color="#666" />
                            <Text style={styles.infoText}>{event.time}</Text>
                        </View>
                    )}
                    {event.venue && (
                        <View style={styles.infoRow}>
                            <MapPin size={20} color="#666" />
                            <Text style={styles.infoText}>{event.venue}</Text>
                        </View>
                    )}
                </View>

                {event.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About Event</Text>
                        <Text style={styles.description}>{event.description}</Text>
                    </View>
                )}

                {(event.contactPerson || event.contactNumber) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Person</Text>
                        {event.contactPerson && (
                            <View style={styles.infoRow}>
                                <User size={20} color="#666" />
                                <Text style={styles.infoText}>{event.contactPerson}</Text>
                            </View>
                        )}
                        {event.contactNumber && (
                            <View style={styles.infoRow}>
                                <Phone size={20} color="#666" />
                                <Text style={styles.infoText}>{event.contactNumber}</Text>
                            </View>
                        )}
                    </View>
                )}

                {event.capacity && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Availability</Text>
                        <View style={styles.capacityContainer}>
                            <Text style={styles.capacityText}>
                                Seats Filled: {event.capacity - (event.remainingSeats || 0)} / {event.capacity}
                            </Text>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${Math.min(((event.capacity - (event.remainingSeats || 0)) / event.capacity) * 100, 100)}%` }
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            isRegistered && styles.registeredButton,
                            event.remainingSeats <= 0 && !isRegistered && styles.disabledButton
                        ]}
                        onPress={handleRegister}
                        disabled={event.remainingSeats <= 0 && !isRegistered}
                    >
                        <Text style={styles.registerButtonText}>
                            {isRegistered ? 'Unregister' : event.remainingSeats <= 0 ? 'Event Full' : 'Register Now'}
                        </Text>
                    </TouchableOpacity>

                    {!isRegistered && (
                        <TouchableOpacity
                            style={[styles.interestButton, isInterested && styles.interestedButton]}
                            onPress={handleInterest}
                        >
                            <Text style={[styles.interestButtonText, isInterested && styles.interestedButtonText]}>
                                {isInterested ? 'Interested ✓' : 'Mark as Interested'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
    buttonContainer: {
        marginTop: 8,
    },
    registerButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
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
    interestButton: {
        backgroundColor: 'white',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF9800',
    },
    interestedButton: {
        backgroundColor: '#FF9800',
    },
    interestButtonText: {
        color: '#FF9800',
        fontSize: 16,
        fontWeight: '600',
    },
    interestedButtonText: {
        color: 'white',
    },
});

export default EventDetailsScreen;
