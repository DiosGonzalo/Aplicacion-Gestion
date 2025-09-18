import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../lib/firebaseConfig';
import { styles } from '../../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos vacíos', 'Introduce tu correo y contraseña.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Correo inválido', 'Introduce un correo válido.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Login error:', error.code);

      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Correo inválido', 'Revisa el formato del correo.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Usuario no encontrado', 'Este correo no está registrado.');
          break;
        case 'auth/invalid-credential':
          Alert.alert('Usuario/Contraseña incorrectos', 'Revisa tus datos e inténtalo de nuevo.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Contraseña incorrecta', 'La contraseña es incorrecta.');
          break;
        case 'auth/too-many-requests':
          Alert.alert(
            'Demasiados intentos',
            'Acceso temporalmente deshabilitado. Intenta más tarde.'
          );
          break;
        default:
          Alert.alert('Error de inicio de sesión', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Correo vacío', 'Por favor, introduce tu correo electrónico para restablecer la contraseña.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Correo de restablecimiento enviado',
        'Se ha enviado un correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada.'
      );
    } catch (error: any) {
      console.log('Forgot password error:', error.code);
      Alert.alert('Error', 'Ha ocurrido un problema. Por favor, verifica el correo e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            Miguel Delgado
          </Text>
        </View>
        <Text style={styles.title}>
          Iniciar Sesión
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#AAAAAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPasswordButtonText}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordButtonText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        )}

        <View style={styles.registerLink}>
          <Text style={styles.registerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
            <Text style={styles.registerButton}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}