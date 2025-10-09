// User storage utilities for localStorage management

const STORAGE_KEY = 'veritas_user_info';

export const saveUserInfo = (userInfo) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Error saving user info to localStorage:', error);
    return false;
  }
};

export const loadUserInfo = () => {
  try {
    const savedUserInfo = localStorage.getItem(STORAGE_KEY);
    if (savedUserInfo) {
      const parsed = JSON.parse(savedUserInfo);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading user info from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

export const clearUserInfo = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user info from localStorage:', error);
    return false;
  }
};

export const hasUserInfo = () => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
