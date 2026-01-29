import CryptoJS from "crypto-js";

const SECRET_KEY = "b1zP0l3!@#2025$SuperSecretKey$%bizpoleOne";

// ✅ Securely save any type of data (object or string)
export const setSecureItem = (key, value) => {
  try {
    // Convert to string once
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  } catch (err) {
    console.error("Error encrypting:", err);
  }
};

// ✅ Securely get and parse data
export const getSecureItem = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(decrypted); // if it's JSON
    } catch {
      return decrypted; // else return as string
    }
  } catch (err) {
    console.error("Error decrypting:", err);
    return null;
  }
};

// ✅ Remove item
export const removeSecureItem = (key) => {
  localStorage.removeItem(key);
};
