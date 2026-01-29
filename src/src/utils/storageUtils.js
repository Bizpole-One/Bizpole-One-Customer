import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Encrypt any data
export const encryptData = (data) => {
  try {
    const stringData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// Decrypt the data
export const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

// Save encrypted data to localStorage
export const setEncryptedItem = (key, value) => {
  const encrypted = encryptData(value);
  localStorage.setItem(key, encrypted);
};

// Get decrypted data from localStorage
export const getDecryptedItem = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return decryptData(item);
};
