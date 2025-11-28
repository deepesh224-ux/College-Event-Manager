import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import EventListScreen from '../screens/EventListScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import MyDayScreen from '../screens/MyDayScreen';
import AdminEventListScreen from '../screens/AdminEventListScreen';
import AdminEventFormScreen from '../screens/AdminEventFormScreen';
import AdminParticipantsScreen from '../screens/AdminParticipantsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EventList"
                component={EventListScreen}
                options={{ title: 'Campus Events' }}
            />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: 'Event Details' }}
            />
            <Stack.Screen
                name="MyEvents"
                component={MyEventsScreen}
                options={{ title: 'My Events' }}
            />
            <Stack.Screen
                name="MyDay"
                component={MyDayScreen}
                options={{ title: 'My Day' }}
            />
            <Stack.Screen
                name="AdminEventList"
                component={AdminEventListScreen}
                options={{ title: 'Manage Events' }}
            />
            <Stack.Screen
                name="AdminEventForm"
                component={AdminEventFormScreen}
                options={{ title: 'Event Form' }}
            />
            <Stack.Screen
                name="AdminParticipants"
                component={AdminParticipantsScreen}
                options={{ title: 'Participants' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
