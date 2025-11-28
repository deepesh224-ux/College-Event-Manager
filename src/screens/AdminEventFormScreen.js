import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const AdminEventFormScreen = ({ navigation, route }) => {
    const eventToEdit = route.params?.event;
    const isEditing = !!eventToEdit;

    const [title, setTitle] = useState(eventToEdit?.title || '');
    const [date, setDate] = useState(eventToEdit?.date || '');
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [venue, setVenue] = useState(eventToEdit?.venue || '');
    const [type, setType] = useState(eventToEdit?.type || 'Technical');
    const [description, setDescription] = useState(eventToEdit?.description || '');
    const [capacity, setCapacity] = useState(eventToEdit?.capacity?.toString() || '');
    const [image, setImage] = useState(eventToEdit?.image || '');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Event' : 'Create Event',
        });
    }, [navigation, isEditing]);

    const handleSave = () => {
        if (!title || !date || !time || !venue || !description || !capacity) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Mock Save Logic
        Alert.alert(
            'Success',
            `Event ${isEditing ? 'updated' : 'created'} successfully!`,
            [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]
        );
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
                        <Text style={styles.label}>Time *</Text>
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
                        {['Technical', 'Cultural', 'Sports'].map((t) => (
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
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput
                        style={styles.input}
                        value={image}
                        onChangeText={setImage}
                        placeholder="https://..."
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
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
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
