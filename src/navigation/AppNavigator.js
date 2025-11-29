import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUser } from '../context/UserContext';

// Import Screens
import AuthScreen from '../screens/AuthScreen';
import EventListScreen from '../screens/EventListScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import MyDayScreen from '../screens/MyDayScreen';
import AdminEventListScreen from '../screens/AdminEventListScreen';
import AdminEventFormScreen from '../screens/AdminEventFormScreen';
import AdminParticipantsScreen from '../screens/AdminParticipantsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Logout Button Component
 * Shows in the header with confirmation dialog
 */
const LogoutButton = () => {
    const { signOut, getDisplayName } = useUser();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            `Are you sure you want to logout?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    );
};

/**
 * Student Flow - Bottom Tab Navigator
 * Contains three tabs: Events, My Events, and My Day
 * Each tab has its own stack for nested navigation
 */
const EventsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
            accessibilityLabel="nav-events-stack"
        >
            <Stack.Screen
                name="EventList"
                component={EventListScreen}
                options={{
                    title: 'All Events',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: 'Event Details' }}
            />

        </Stack.Navigator>
    );
};

const MyEventsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
            accessibilityLabel="nav-my-events-stack"
        >
            <Stack.Screen
                name="MyEventsList"
                component={MyEventsScreen}
                options={{
                    title: 'My Events',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: 'Event Details' }}
            />
        </Stack.Navigator>
    );
};

const MyDayStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
            accessibilityLabel="nav-my-day-stack"
        >
            <Stack.Screen
                name="MyDayList"
                component={MyDayScreen}
                options={{
                    title: 'My Day',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: 'Event Details' }}
            />
        </Stack.Navigator>
    );
};

const StudentFlow = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            accessibilityLabel="nav-student-tabs"
        >
            <Tab.Screen
                name="EventsTab"
                component={EventsStack}
                options={{
                    title: 'Events',
                    tabBarAccessibilityLabel: 'tab-events',
                }}
            />
            <Tab.Screen
                name="MyEventsTab"
                component={MyEventsStack}
                options={{
                    title: 'My Events',
                    tabBarAccessibilityLabel: 'tab-my-events',
                }}
            />
            <Tab.Screen
                name="MyDayTab"
                component={MyDayStack}
                options={{
                    title: 'My Day',
                    tabBarAccessibilityLabel: 'tab-my-day',
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * Admin Flow - Stack Navigator
 * Contains screens for managing events and viewing participants
 */
const AdminFlow = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
            accessibilityLabel="nav-admin-stack"
        >
            <Stack.Screen
                name="AdminEventList"
                component={AdminEventListScreen}
                options={{
                    title: 'Manage Events',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <Stack.Screen
                name="AdminEventForm"
                component={AdminEventFormScreen}
                options={({ route }) => ({
                    title: route.params?.eventId ? 'Edit Event' : 'Create Event',
                })}
            />
            <Stack.Screen
                name="AdminParticipants"
                component={AdminParticipantsScreen}
                options={{ title: 'Event Participants' }}
            />
        </Stack.Navigator>
    );
};

/**
 * Root Navigator
 * Determines which flow to show based on user authentication and role
 */
const RootNavigator = () => {
    const { user } = useUser();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            accessibilityLabel="nav-root"
        >
            {!user ? (
                // User not authenticated - show auth screen
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{ title: 'Login' }}
                />
            ) : user.isAdmin ? (
                // User is admin - show admin flow
                <Stack.Screen
                    name="AdminApp"
                    component={AdminFlow}
                    options={{ title: 'Admin Portal' }}
                />
            ) : (
                // User is student - show student flow
                <Stack.Screen
                    name="StudentApp"
                    component={StudentFlow}
                    options={{ title: 'Events App' }}
                />
            )}
        </Stack.Navigator>
    );
};

/**
 * Main App Navigator
 * Wraps the root navigator
 * Note: NavigationContainer is provided in App.js
 */
const AppNavigator = () => {
    return <RootNavigator />;
};

/**
 * Navigation Helper Functions
 * Use these to navigate programmatically with proper params
 */

/**
 * Navigate to event details by ID
 * @param {object} navigation - Navigation object from useNavigation hook
 * @param {string} eventId - ID of the event to view
 */
export const navigateToEventDetails = (navigation, eventId) => {
    navigation.navigate('EventDetails', { eventId });
};

/**
 * Navigate to admin event form (create or edit)
 * @param {object} navigation - Navigation object from useNavigation hook
 * @param {string|null} eventId - ID of event to edit, or null to create new
 */
export const navigateToAdminEventForm = (navigation, eventId = null) => {
    navigation.navigate('AdminEventForm', eventId ? { eventId } : {});
};

/**
 * Navigate to admin participants screen
 * @param {object} navigation - Navigation object from useNavigation hook
 * @param {string} eventId - ID of the event to view participants
 */
export const navigateToAdminParticipants = (navigation, eventId) => {
    navigation.navigate('AdminParticipants', { eventId });
};

/**
 * Styles for navigation components
 */
const styles = StyleSheet.create({
    logoutButton: {
        marginRight: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AppNavigator;

