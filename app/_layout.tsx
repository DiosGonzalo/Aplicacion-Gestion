import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { auth, db } from '../lib/firebaseConfig';

export default function RootLayout() {
  const [role, setRole] = useState<'cliente' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const router = useRouter();

  // 🔹 Detectar usuario y rol (sin cambios)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let determinedRole: 'cliente' | 'admin' | null = null;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Usuarios', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            determinedRole =
              data?.rol === 'admin' || data?.rol === 'cliente'
                ? data.rol
                : 'cliente';
          } else {
            determinedRole = 'cliente';
          }
        } catch (error) {
          console.error('Error fetching user role from Firestore:', error);
          determinedRole = 'cliente';
        }
      }

      setRole(determinedRole);
      setLoading(false);
      setInitialCheckComplete(true);
    });

    return unsubscribe;
  }, []);

  // 🔹 Navegación según rol (sin cambios)
  useEffect(() => {
    if (!initialCheckComplete) return;

    if (role === 'admin') {
      router.replace('./(adminTabs)');
    } else if (role === 'cliente') {
      router.replace('./(tabs)');
    } else {
      router.replace('/login');
    }
  }, [role, initialCheckComplete]);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12151f',
  },
});