import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useEvents } from '../context/EventsContext';

const AdminEventFormScreen = ({ navigation, route }) => {
    const { eventId } = route.params || {};
    const { getEventById, createEvent, editEvent } = useEvents();

    const eventToEdit = eventId ? getEventById(eventId) : null;
    const isEditing = !!eventToEdit;

    const [title, setTitle] = useState(eventToEdit?.title || '');
    const [date, setDate] = useState(eventToEdit?.date || '');
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [venue, setVenue] = useState(eventToEdit?.venue || '');
    const [type, setType] = useState(eventToEdit?.type || 'Technical');
    const [description, setDescription] = useState(eventToEdit?.description || '');
    const [capacity, setCapacity] = useState(eventToEdit?.capacity?.toString() || '');
    const [image, setImage] = useState(eventToEdit?.image || '');
    const [contactPerson, setContactPerson] = useState(eventToEdit?.contactPerson || '');
    const [contactNumber, setContactNumber] = useState(eventToEdit?.contactNumber || '');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Event' : 'Create Event',
        });
    }, [navigation, isEditing]);

    const handleSave = async () => {
        if (!title || !date || !venue || !description || !capacity) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const capacityNum = parseInt(capacity);
        if (isNaN(capacityNum) || capacityNum <= 0) {
            Alert.alert('Error', 'Capacity must be a positive number');
            return;
        }

        const eventData = {
            title,
            date,
            time,
            venue,
            type,
            description,
            capacity: capacityNum,
            image,
            contactPerson,
            contactNumber,
        };

        let result;
        if (isEditing) {
            result = await editEvent(eventId, eventData);
        } else {
            result = await createEvent(eventData);
        }

        if (result.success) {
            Alert.alert(
                'Success',
                `Event ${isEditing ? 'updated' : 'created'} successfully!`,
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        } else {
            Alert.alert('Error', 'Failed to save event');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Event Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g., Tech Symposium 2024"
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Date *</Text>
                        <TextInput
                            style={styles.input}
                            value={date}
                            onChangeText={setDate}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Time</Text>
                        <TextInput
                            style={styles.input}
                            value={time}
                            onChangeText={setTime}
                            placeholder="e.g., 10:00 AM"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Venue *</Text>
                    <TextInput
                        style={styles.input}
                        value={venue}
                        onChangeText={setVenue}
                        placeholder="e.g., Main Auditorium"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Event Type</Text>
                    <View style={styles.typeContainer}>
                        {['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeButton, type === t && styles.activeTypeButton]}
                                onPress={() => setType(t)}
                            >
                                <Text style={[styles.typeText, type === t && styles.activeTypeText]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Capacity *</Text>
                    <TextInput
                        style={styles.input}
                        value={capacity}
                        onChangeText={setCapacity}
                        placeholder="e.g., 200"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contact Person</Text>
                    <TextInput
                        style={styles.input}
                        value={contactPerson}
                        onChangeText={setContactPerson}
                        placeholder="e.g., John Doe"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        placeholder="e.g., +91 1234567890"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput
                        style={styles.input}
                        value={image}
                        onChangeText={setImage}
                        placeholder="https://..."
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Event details..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{isEditing ? 'Update Event' : 'Create Event'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    activeTypeButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    typeText: {
        color: '#666',
    },
    activeTypeText: {
        color: 'white',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminEventFormScreen;
