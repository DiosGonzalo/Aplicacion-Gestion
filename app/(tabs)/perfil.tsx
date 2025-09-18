import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebaseConfig';
import { styles } from '../../styles/perfil.styles';

export default function PerfilScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);

  useEffect(() => {
    if (!user) {
      Alert.alert('Error', 'No se encontró usuario autenticado.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'Usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setTelefono(data.telefono || '');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error("Error al cargar la información del perfil:", error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'Usuarios', user.uid);
      await setDoc(
        docRef,
        {
          nombre,
          telefono,
        },
        { merge: true }
      );
      Alert.alert('Éxito', 'Datos actualizados correctamente.');
    } catch (error) {
      console.error("Error al guardar la información del perfil:", error);
      Alert.alert('Error', 'No se pudo guardar la información.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const userDocRef = doc(db, 'Usuarios', user.uid);
              await deleteDoc(userDocRef);

              await deleteUser(user);
              
              Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido eliminada con éxito.');
              router.replace('/(auth)/login');
            } catch (error: any) {
              console.error("Error al eliminar la cuenta:", error);
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Error',
                  'Para tu seguridad, debes volver a iniciar sesión para eliminar tu cuenta.'
                );
              } else {
                Alert.alert('Error', 'No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde.');
              }
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No se encontró tu correo electrónico.');
      return;
    }

    setSendingResetEmail(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert('Correo Enviado', 'Se ha enviado un correo electrónico para que puedas cambiar tu contraseña. Revisa tu bandeja de entrada.');
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento:", error);
      Alert.alert('Error', 'No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo más tarde.');
    } finally {
      setSendingResetEmail(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconSymbol size={30} name="person.circle.fill" color="#333" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Introduce tu correo"
            placeholderTextColor="#888"
            editable={false}
          />

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Introduce tu nombre"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholder="Introduce tu teléfono"
            placeholderTextColor="#888"
          />

          {saving ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.saveIndicator} />
          ) : (
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.logoutButtonContainer}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </Pressable>
        </View>

        <View style={styles.deleteButtonContainer}>
          {sendingResetEmail ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Pressable style={styles.passwordResetButton} onPress={handleForgotPassword}>
              <Text style={styles.passwordResetButtonText}>Cambiar/Olvidé mi contraseña</Text>
            </Pressable>
          )}
          {deleting ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}