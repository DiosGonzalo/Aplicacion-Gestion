import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Solo importa AsyncStorage si no es web
let ReactNativeAsyncStorage: any = null;
if (Platform.OS !== 'web') {
  ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-x0L40ly7QDkk3t2hlmcBprQeOYhJfE8",
  authDomain: "miguelibarber.firebaseapp.com",
  projectId: "miguelibarber",
  storageBucket: "miguelibarber.appspot.com",
  messagingSenderId: "466913275161",
  appId: "1:466913275161:web:229044c9a40bc9db706988",
  measurementId: "G-P13H670VLN"
};

// Usa app existente si ya está inicializada
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa Auth solo si no está ya inicializado
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

export const db = getFirestore(app);
export const storage = getStorage(app);