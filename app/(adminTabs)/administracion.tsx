import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { auth } from '../../lib/firebaseConfig';
import { styles } from '../../styles/administracion.styles';

export default function AdministracionScreen() {
    const router = useRouter();

    const [accesoPermitido, setAccesoPermitido] = useState(false);
    const [inputPassword, setInputPassword] = useState('');

    const PASSWORD = 'admin123'; // ¡Considera mover esto a una variable de entorno para producción!

    useFocusEffect(
        useCallback(() => {
            setAccesoPermitido(false);
            setInputPassword('');
        }, [])
    );

    const handleCheckPassword = () => {
        if (inputPassword === PASSWORD) {
            setAccesoPermitido(true);
        } else {
            Alert.alert('Contraseña incorrecta', 'Intenta nuevamente.');
        }
        setInputPassword('');
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.replace('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión.');
        }
    };

    const handleGoToPeluqueros = () => {
        router.push('../admin-routes/peluqueros');
    };

    const handleGoToInformes = () => {
        router.push('../admin-routes/informes');
    };

    const handleGoToHourManagement = () => {
        router.push('../admin-routes/controlHoras'); // Asegúrate de que esta ruta sea correcta en tu navegador
    };

    if (!accesoPermitido) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Área de Administración</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Introduce la contraseña"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={inputPassword}
                    onChangeText={setInputPassword}
                />
                <Pressable style={styles.loginButton} onPress={handleCheckPassword}>
                    <Text style={styles.loginText}>Acceder</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panel de Administración</Text>

            <Pressable style={styles.adminOptionButton} onPress={handleGoToPeluqueros}>
                <Ionicons name="cut" size={24} color={styles.adminOptionIcon.color} style={styles.adminOptionIcon} />
                <Text style={styles.adminOptionText}>Gestionar Peluqueros</Text>
            </Pressable>

            <Pressable style={styles.adminOptionButton} onPress={handleGoToInformes}>
                <Ionicons name="stats-chart" size={24} color={styles.adminOptionIcon.color} style={styles.adminOptionIcon} />
                <Text style={styles.adminOptionText}>Ver Informes</Text>
            </Pressable>

            <Pressable style={styles.adminOptionButton} onPress={handleGoToHourManagement}>
                <Ionicons name="calendar" size={24} color={styles.adminOptionIcon.color} style={styles.adminOptionIcon} />
                <Text style={styles.adminOptionText}>Gestionar Horarios</Text>
            </Pressable>

            <View style={styles.spacer} />

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={24} color={styles.logoutIcon.color} style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}