import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { User, Lock, Mail, BookOpen } from 'lucide-react-native';
import { useUser } from '../context/UserContext';

const AuthScreen = () => {
    const { signIn } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Check if admin login
        const isAdmin = email === 'admin@college.edu' && password === 'admin';

        if (!isLogin && !name) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        // Create user object
        const userObj = {
            name: isAdmin ? 'Admin User' : name || email.split('@')[0],
            email,
            isAdmin,
        };

        // Add student-specific fields
        if (!isAdmin && !isLogin) {
            if (rollNo) userObj.rollNumber = rollNo;
        }

        // Sign in using UserContext
        const result = await signIn(userObj);

        if (!result.success) {
            Alert.alert('Sign In Failed', result.message || 'Please try again');
        }
        // Navigation will happen automatically via AppNavigator based on user role
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <BookOpen size={40} color="#007AFF" />
                    </View>
                    <Text style={styles.appName}>CampusHub</Text>
                    <Text style={styles.tagline}>College Event Manager</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.headerText}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

                    {!isLogin && (
                        <>
                            <View style={styles.inputContainer}>
                                <User size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.hashIcon}>#</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Roll Number (Optional)"
                                    value={rollNo}
                                    onChangeText={setRollNo}
                                />
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <Mail size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                        <Text style={styles.authButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </Text>
                    </TouchableOpacity>

                    {isLogin && (
                        <TouchableOpacity onPress={() => {
                            setEmail('admin@college.edu');
                            setPassword('admin');
                        }} style={styles.adminHint}>
                            <Text style={styles.adminHintText}>Tap for Admin Demo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    tagline: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputIcon: {
        marginRight: 10,
    },
    hashIcon: {
        fontSize: 20,
        color: '#666',
        marginRight: 14,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    authButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    authButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchText: {
        color: '#007AFF',
        fontSize: 14,
    },
    adminHint: {
        marginTop: 20,
        alignItems: 'center',
    },
    adminHintText: {
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
    }
});

export default AuthScreen;
