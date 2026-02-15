import React, { createContext, useState, useEffect } from "react";
import { Platform } from 'react-native';
import {
    CAMPUSHUB_CURRENT_USER,
    saveKey,
    loadKey,
} from "../services/storageService";
import * as validation from "../utils/validation";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const user = await loadKey(CAMPUSHUB_CURRENT_USER);
            if (user) {
                setCurrentUser(user);
                setIsAuthenticated(true);
            }
            setLoading(false);
        })();
    }, []);

    const signIn = async (userObj) => {
        // Validate based on role
        if (!userObj.isAdmin) {
            const result = validation.validateStudentForm(userObj);
            // Fix: Check isValid, not success
            if (!result.isValid) {
                return {
                    success: false,
                    message: Object.values(result.errors).join(', '),
                    errors: result.errors
                };
            }
        }

        // Generate ID if missing
        if (!userObj.id) {
            userObj.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        setCurrentUser(userObj);
        setIsAuthenticated(true);
        await saveKey(CAMPUSHUB_CURRENT_USER, userObj);
        return { success: true };
    };

    const signOut = async () => {
        console.log('[UserContext] signOut called. Platform:', Platform.OS);

        try {
            // Hardcode key to be sure
            const KEY = "CAMPUSHUB_CURRENT_USER";

            // 1. Clear storage via AsyncStorage
            await saveKey(KEY, null);
            console.log('[UserContext] saveKey(null) called');

            // 2. Force clear localStorage on web
            if (Platform.OS === 'web') {
                console.log('[UserContext] Force clearing localStorage for web');
                try {
                    localStorage.removeItem(KEY);
                    // Verify removal
                    const check = localStorage.getItem(KEY);
                    console.log('[UserContext] Key after removal:', check);

                    // Nuclear option: Reload page to reset all state
                    console.log('[UserContext] Reloading page...');
                    window.location.reload();
                    return { success: true };
                } catch (e) {
                    console.error('[UserContext] localStorage remove failed', e);
                }
            }

            // 3. Update state (for non-web or if reload fails)
            setCurrentUser(null);
            console.log('[UserContext] currentUser set to null');
            setIsAuthenticated(false);

        } catch (error) {
            console.error('[UserContext] signOut error:', error);
        }
        return { success: true };
    };

    const updateProfile = async (fields) => {
        if (!currentUser) return { success: false, message: 'No user signed in' };

        const updated = { ...currentUser, ...fields };

        if (!updated.isAdmin) {
            const result = validation.validateStudentForm(updated);
            if (!result.isValid) {
                return {
                    success: false,
                    message: Object.values(result.errors).join(', '),
                    errors: result.errors
                };
            }
        }

        setCurrentUser(updated);
        await saveKey(CAMPUSHUB_CURRENT_USER, updated);
        return { success: true };
    };

    const isAdmin = () => currentUser?.isAdmin === true;
    const isStudent = () => currentUser && !currentUser.isAdmin;
    const getDisplayName = () => currentUser?.name || 'Guest';

    return (
        <UserContext.Provider
            value={{
                currentUser,
                user: currentUser, // Alias
                isAuthenticated,
                loading,
                isLoading: loading, // Alias
                signIn,
                signOut,
                updateProfile,
                isAdmin,
                isStudent,
                getDisplayName
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
