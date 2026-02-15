import AsyncStorage from "@react-native-async-storage/async-storage";


export const CAMPUSHUB_EVENTS = "CAMPUSHUB_EVENTS";
export const CAMPUSHUB_REGISTRATIONS = "CAMPUSHUB_REGISTRATIONS";
export const CAMPUSHUB_INTERESTED = "CAMPUSHUB_INTERESTED";
export const CAMPUSHUB_CURRENT_USER = "CAMPUSHUB_CURRENT_USER";


export async function saveKey(key, value) {
  try {
    if (value === null || value === undefined) {
      console.log(`[storageService] Removing key: ${key}`);
      await AsyncStorage.removeItem(key);
    } else {
      console.log(`[storageService] Saving key: ${key}`, value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
    return { success: true };
  } catch (error) {
    console.error(`[storageService] Error saving key ${key}:`, error);
    return { success: false, error };
  }
}


export async function loadKey(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    // console.log(`[storageService] Loaded key ${key}:`, value);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`[storageService] Error loading key ${key}:`, error);
    return null;
  }
}


export async function loadAll() {
  try {
    const events = JSON.parse(await AsyncStorage.getItem(CAMPUSHUB_EVENTS)) || [];
    const registrations = JSON.parse(await AsyncStorage.getItem(CAMPUSHUB_REGISTRATIONS)) || [];
    const interested = JSON.parse(await AsyncStorage.getItem(CAMPUSHUB_INTERESTED)) || [];
    const currentUser = JSON.parse(await AsyncStorage.getItem(CAMPUSHUB_CURRENT_USER)) || null;

    return { events, registrations, interested, currentUser };
  } catch (error) {
    return { events: [], registrations: [], interested: [], currentUser: null };
  }
}


export async function saveAll({ events, registrations, interested }) {
  try {
    await AsyncStorage.setItem(CAMPUSHUB_EVENTS, JSON.stringify(events));
    await AsyncStorage.setItem(CAMPUSHUB_REGISTRATIONS, JSON.stringify(registrations));
    await AsyncStorage.setItem(CAMPUSHUB_INTERESTED, JSON.stringify(interested));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}


export async function clearAll() {
  try {
    await AsyncStorage.clear();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export function migrateIfNeeded(data) {
  return data;
}
