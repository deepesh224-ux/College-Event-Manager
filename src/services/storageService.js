import AsyncStorage from "@react-native-async-storage/async-storage";


export const CAMPUSHUB_EVENTS = "CAMPUSHUB_EVENTS";
export const CAMPUSHUB_REGISTRATIONS = "CAMPUSHUB_REGISTRATIONS";
export const CAMPUSHUB_INTERESTED = "CAMPUSHUB_INTERESTED";
export const CAMPUSHUB_CURRENT_USER = "CAMPUSHUB_CURRENT_USER";


export async function saveKey(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}


export async function loadKey(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}
