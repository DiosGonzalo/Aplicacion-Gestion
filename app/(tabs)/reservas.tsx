import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SectionList, // <-- Importar SectionList
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebaseConfig';
import { styles } from '../../styles/reservas.styles';

dayjs.locale('es');

// --- TIPOS DE DATOS ---
type ReservaDisplay = {
    id: string;
    clienteNombre: string;
    nombreReserva: string;
    fecha: string;
    hora: string;
    peluqueroId: string;
    servicioId: string;
    estado: 'pendiente' | 'completada' | 'cancelada';
    creadoEn: Date;
    peluqueroNombre: string;
    servicioNombre: string;
};

type Bono = {
    id: string;
    tipo: string;
    totalCortes: number;
    cortesUsados: number;
    fechaInicio: string;
    fechaExpiracion: string;
};

type Peluquero = {
    id: string;
    nombre: string;
};

type Servicio = {
    id: string;
    nombre: string;
    precio: number;
};

export default function ReservasScreen() {
    const [reservas, setReservas] = useState<ReservaDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [bonoDelUsuario, setBonoDelUsuario] = useState<Bono | null>(null);
    const [loadingBono, setLoadingBono] = useState(true);

    const fetchUserName = useCallback(async (uid: string) => {
        try {
            const userRef = doc(db, 'Usuarios', uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserName(data?.nombre || '');
            }
        } catch (e) {
            console.error('Error al cargar nombre de usuario:', e);
        }
    }, []);

    const fetchPeluquerosAndServicios = async () => {
        const peluquerosMap: { [key: string]: string } = {};
        const serviciosMap: { [key: string]: string } = {};

        try {
            const [peluquerosSnapshot, serviciosSnapshot] = await Promise.all([
                getDocs(collection(db, 'Peluqueros')),
                getDocs(collection(db, 'Servicios')),
            ]);

            peluquerosSnapshot.docs.forEach(doc => {
                peluquerosMap[doc.id] = doc.data().nombre;
            });

            serviciosSnapshot.docs.forEach(doc => {
                serviciosMap[doc.id] = doc.data().nombre;
            });

        } catch (error) {
            console.error('Error cargando peluqueros/servicios para mapeo:', error);
        }
        return { peluquerosMap, serviciosMap };
    };
    
    // Función de carga de reservas (sin cambios)
    const fetchReservas = async (uid: string) => {
        setLoading(true);
        try {
            const { peluquerosMap, serviciosMap } = await fetchPeluquerosAndServicios();

            const q = query(collection(db, 'Reservas'), where('clienteId', '==', uid));
            const querySnapshot = await getDocs(q);

            const fetched: ReservaDisplay[] = querySnapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                const reserva: ReservaDisplay = {
                    id: docSnap.id,
                    clienteNombre: data.clienteNombre || 'N/A',
                    nombreReserva: data.nombreReserva || data.clienteNombre || 'N/A',
                    fecha: data.fecha,
                    hora: data.hora,
                    peluqueroId: data.peluqueroId,
                    servicioId: data.servicioId,
                    estado: data.estado as 'pendiente' | 'completada' | 'cancelada' || 'pendiente',
                    creadoEn: data.creadoEn?.toDate ? data.creadoEn.toDate() : new Date(),
                    peluqueroNombre: peluquerosMap[data.peluqueroId] || 'Desconocido',
                    servicioNombre: serviciosMap[data.servicioId] || 'Desconocido',
                };
                return reserva;
            });

            fetched.sort((a, b) => {
                const dateTimeA = dayjs(`${a.fecha}T${a.hora}`);
                const dateTimeB = dayjs(`${b.fecha}T${b.hora}`);
                // Ordenar del más reciente al más antiguo
                return dateTimeB.valueOf() - dateTimeA.valueOf();
            });

            setReservas(fetched);
        } catch (error) {
            console.error('Error cargando reservas:', error);
            Alert.alert('Error', 'No se pudo cargar la lista de reservas.');
        } finally {
            setLoading(false);
        }
    };

    // Este useEffect se encarga de escuchar el estado del bono en tiempo real
    useEffect(() => {
        if (!userId) return;

        setLoadingBono(true);
        const q = query(collection(db, 'Bonos'), where('userId', '==', userId));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const bonoDoc = querySnapshot.docs[0];
                const bonoData = bonoDoc.data();
                if (bonoData.cortesUsados < bonoData.totalCortes) {
                    setBonoDelUsuario({
                        id: bonoDoc.id,
                        tipo: bonoData.tipo,
                        totalCortes: bonoData.totalCortes,
                        cortesUsados: bonoData.cortesUsados,
                        fechaInicio: bonoData.fechaInicio,
                        fechaExpiracion: bonoData.fechaExpiracion,
                    });
                } else {
                    setBonoDelUsuario(null);
                }
            } else {
                setBonoDelUsuario(null);
            }
            setLoadingBono(false);
        }, (error) => {
            console.error('Error en el listener del bono:', error);
            setLoadingBono(false);
        });

        // La función de limpieza se llama cuando el componente se desmonta
        return () => unsubscribe();
    }, [userId]);
    
    // Este useEffect solo maneja el estado de autenticación
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                fetchUserName(user.uid);
                fetchReservas(user.uid);
            } else {
                setUserId(null);
                setUserName('');
                setReservas([]);
                setBonoDelUsuario(null);
                setLoading(false);
                setLoadingBono(false);
            }
        });
        return unsubscribeAuth;
    }, [fetchUserName]);

    // ... (El resto del código de la pantalla permanece igual)
    
    const cancelarReserva = (reserva: ReservaDisplay) => {
        if (reserva.estado === 'completada' || reserva.estado === 'cancelada') {
            Alert.alert('No se puede cancelar', `Esta cita ya está ${reserva.estado}.`);
            return;
        }

        Alert.alert(
            'Cancelar cita',
            '¿Estás seguro de que quieres cancelar esta cita? Tu reputación podría verse afectada si cancelas con poca antelación.',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const now = dayjs();
                            const reservaDateTime = dayjs(`${reserva.fecha}T${reserva.hora}`);
                            const hoursUntilBooking = reservaDateTime.diff(now, 'hours');

                            await updateDoc(doc(db, 'Reservas', reserva.id), {
                                estado: 'cancelada',
                            });

                            if (userId) {
                                const userRef = doc(db, 'Usuarios', userId);
                                const userDoc = await getDoc(userRef);
                                if (userDoc.exists()) {
                                    const currentReputacion = (userDoc.data() as { reputacion?: 'buena' | 'regular' | 'mala' }).reputacion || 'regular';
                                    let newReputacion: 'buena' | 'regular' | 'mala' = currentReputacion;

                                    if (hoursUntilBooking < 24 && currentReputacion === 'buena') {
                                        newReputacion = 'regular';
                                    } else if (hoursUntilBooking < 24 && currentReputacion === 'regular') {
                                        newReputacion = 'mala';
                                    }

                                    if (newReputacion !== currentReputacion) {
                                        await updateDoc(userRef, { reputacion: newReputacion });
                                        console.log(`Reputación actualizada para el cliente ${userId}: de ${currentReputacion} a ${newReputacion}`);
                                    }
                                }
                            }
                            Alert.alert('Cita Cancelada', 'Tu cita ha sido marcada como cancelada.');
                            fetchReservas(userId!);
                        } catch (error) {
                            console.error('Error cancelando reserva:', error);
                            Alert.alert('Error', 'No se pudo cancelar la cita.');
                        }
                    },
                },
            ]
        );
    };

    const getStatusStyle = (estado: string) => {
        switch (estado) {
            case 'pendiente':
                return styles.statusPendiente;
            case 'completada':
                return styles.statusCompletada;
            case 'cancelada':
                return styles.statusCancelada;
            default:
                return {};
        }
    };

    const renderItem = ({ item }: { item: ReservaDisplay }) => {
        const dateTime = dayjs(`${item.fecha}T${item.hora}`);
        const formattedDate = dateTime.format('dddd, D [de] MMMM [de] YYYY');
        const formattedTime = dateTime.format('HH:mm');

        const shouldShowCancelButton = item.estado !== 'completada';
        const isCancellable = item.estado === 'pendiente';

        return (
            <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.nombreReserva}</Text>
                    <Text style={[styles.itemStatus, getStatusStyle(item.estado)]}>
                        {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                    </Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.detailText}>
                        <MaterialCommunityIcons name="calendar-month" size={16} color="#666" style={styles.detailIcon} />
                        {formattedDate}
                    </Text>
                    <Text style={styles.detailText}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#666" style={styles.detailIcon} />
                        {formattedTime}
                    </Text>
                    <Text style={styles.detailText}>
                        <MaterialCommunityIcons name="face-recognition" size={16} color="#666" style={styles.detailIcon} />
                        Peluquero: {item.peluqueroNombre}
                    </Text>
                    <Text style={styles.detailText}>
                        <MaterialCommunityIcons name="scissors-cutting" size={16} color="#666" style={styles.detailIcon} />
                        Servicio: {item.servicioNombre}
                    </Text>
                </View>
                {shouldShowCancelButton && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.cancelButton,
                            !isCancellable && styles.cancelButtonDisabled,
                            pressed && isCancellable && styles.cancelButtonPressed,
                        ]}
                        onPress={() => cancelarReserva(item)}
                        disabled={!isCancellable}
                    >
                        <MaterialCommunityIcons name="close-circle" size={20} color="#fff" style={styles.cancelButtonIcon} />
                        <Text style={styles.cancelButtonText}>
                            {isCancellable ? 'Cancelar Cita' : `Cita ${item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}`}
                        </Text>
                    </Pressable>
                )}
            </View>
        );
    };

    // Función que procesa las reservas para el SectionList
    const getSectionedData = () => {
        const now = dayjs();
        const pendingReservas = reservas.filter(reserva => reserva.estado === 'pendiente' && dayjs(`${reserva.fecha}T${reserva.hora}`).isAfter(now));
        const historicalReservas = reservas.filter(reserva => reserva.estado !== 'pendiente' || dayjs(`${reserva.fecha}T${reserva.hora}`).isBefore(now));

        const sections = [];

        if (pendingReservas.length > 0) {
            sections.push({
                title: 'Próximas Citas',
                data: pendingReservas.sort((a, b) => {
                    const dateTimeA = dayjs(`${a.fecha}T${a.hora}`);
                    const dateTimeB = dayjs(`${b.fecha}T${b.hora}`);
                    return dateTimeA.valueOf() - dateTimeB.valueOf(); // Más antigua a más reciente
                }),
            });
        }

        if (historicalReservas.length > 0) {
            sections.push({
                title: 'Historial de Citas',
                data: historicalReservas.sort((a, b) => {
                    const dateTimeA = dayjs(`${a.fecha}T${a.hora}`);
                    const dateTimeB = dayjs(`${b.fecha}T${b.hora}`);
                    return dateTimeB.valueOf() - dateTimeA.valueOf(); // Más reciente a más antigua
                }),
            });
        }
        
        return sections;
    };
    
    if (loading || loadingBono) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando tus reservas...</Text>
            </SafeAreaView>
        );
    }
    
    // Preparar los datos seccionados para SectionList
    const sectionedData = getSectionedData();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="calendar-check" size={30} color="#333" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Mis Reservas</Text>
                    {userName && <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>}
                    {bonoDelUsuario && (
                        <View style={styles.bonoContainer}>
                            <MaterialCommunityIcons name="ticket-confirmation" size={20} color="#00BFA5" />
                            <Text style={styles.bonoText}>
                                Bono activo: {bonoDelUsuario.cortesUsados}/{bonoDelUsuario.totalCortes} usos
                            </Text>
                        </View>
                    )}
                </View>

                {sectionedData.length === 0 ? (
                    <View style={styles.emptyListContainer}>
                        <MaterialCommunityIcons name="calendar-remove" size={60} color="#ccc" />
                        <Text style={styles.emptyListText}>No tienes reservas activas.</Text>
                        <Text style={styles.emptyListSubText}>¡Es un buen momento para reservar tu próxima cita!</Text>
                    </View>
                ) : (
                    <SectionList
                        sections={sectionedData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.sectionHeaderContainer}>
                                <Text style={styles.sectionHeaderTitle}>{title}</Text>
                            </View>
                        )}
                        refreshing={loading}
                        onRefresh={() => userId && fetchReservas(userId)}
                        contentContainerStyle={styles.flatListContent}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}