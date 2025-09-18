import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import * as Notifications from 'expo-notifications';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebaseConfig';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

import { ClientColors, styles, timeSlotPickerStyles } from '../../styles/index.cliente.styles';

dayjs.extend(isSameOrAfter);
const { width } = Dimensions.get('window');


interface Peluquero {
  id: string;
  nombre: string;
  imageUrl?: string;
  [key: string]: any;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  [key: string]: any;
}

interface LastReserva {
  peluqueroId: string;
  servicioId: string;
  nombreReserva: string;
}

interface TimeSlotPickerProps {
  horasDisponibles: string[];
  horasOcupadas: string[];
  horaSelected: string;
  onSelectHour: (hour: string) => void;
  loading: boolean;
  currentDate: Date;
}

interface WorkingHoursEntry {
  start: string;
  end: string;
}


type WorkingHours = Record<string, WorkingHoursEntry[]>;

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  horasDisponibles,
  horasOcupadas,
  horaSelected,
  onSelectHour,
  loading,
  currentDate,
}) => {
  const now = dayjs();
  const selectedDay = dayjs(currentDate).startOf('day');

  // --- REANIMATED: Valores Compartidos para la Animación ---
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const [showLoadingContent, setShowLoadingContent] = useState(false);

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  // --- REANIMATED: Efecto para Disparar la Animación ---
  useEffect(() => {
    if (loading) {
      setShowLoadingContent(true);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    } else if (showLoadingContent) {
      opacity.value = withTiming(0, { duration: 300 }, (isFinished) => {
        if (isFinished) {
          runOnJS(setShowLoadingContent)(false);
        }
      });
      scale.value = withTiming(0.8, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 });
    }
  }, [loading, showLoadingContent]);

  if (loading || showLoadingContent) {
    return (
      <Animated.View style={[timeSlotPickerStyles.loadingContainer, animatedLoadingStyle]}>
        <ActivityIndicator size="small" color={ClientColors.accentPrimary} />
        <Text style={timeSlotPickerStyles.loadingText}>Cargando horas...</Text>
      </Animated.View>
    );
  }

  return (
    <ScrollView
      style={timeSlotPickerStyles.scrollContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={timeSlotPickerStyles.gridContainer}
    >
      {horasDisponibles.map((hora) => {
        const isOccupied = horasOcupadas.includes(hora);
        const isSelected = horaSelected === hora;
        const slotDateTime = dayjs(currentDate).hour(parseInt(hora.substring(0, 2))).minute(parseInt(hora.substring(3, 5)));
        const isPast = slotDateTime.isBefore(now) && selectedDay.isSame(now, 'day');
        const isDisabled = isOccupied || isPast;

        return (
          <Pressable
            key={hora}
            style={({ pressed }) => [
              timeSlotPickerStyles.timeSlot,
              isDisabled && timeSlotPickerStyles.timeSlotDisabled,
              isOccupied && timeSlotPickerStyles.timeSlotOccupied,
              isSelected && timeSlotPickerStyles.timeSlotSelected,
              pressed && !isDisabled && timeSlotPickerStyles.timeSlotPressed,
            ]}
            onPress={() => !isDisabled && onSelectHour(hora)}
            disabled={isDisabled}
          >
            <Text style={[
              timeSlotPickerStyles.timeSlotText,
              isDisabled && timeSlotPickerStyles.timeSlotTextDisabled,
              isSelected && timeSlotPickerStyles.timeSlotTextSelected,
            ]}>
              {hora}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

// Constantes para el límite de reservas
const TIME_WINDOW_MINUTES = 30; // Nuevo límite de 30 minutos
const RESERVA_LIMIT = 4; // Nuevo límite de 4 reservas

export default function ReservaScreen() {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');
  const [nombreReserva, setNombreReserva] = useState('');
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [peluqueroSelected, setPeluqueroSelected] = useState('');
  const [servicioSelected, setServicioSelected] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [horaSelected, setHoraSelected] = useState('');
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [submittingReserva, setSubmittingReserva] = useState(false);
  const [lastReserva, setLastReserva] = useState<LastReserva | null>(null);

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    '0': [], '1': [], '2': [], '3': [], '4': [], '5': [], '6': [],
  });

  const [dates, setDates] = useState<Date[]>([]);
  const datesFiltradas = dates.filter(date =>
    dayjs(date).startOf('day').isSameOrAfter(dayjs().startOf('day'))
  );

  const flatListRef = useRef<FlatList>(null);

  const initialOpacity = useSharedValue(1);
  const initialScale = useSharedValue(1);
  const initialTranslateY = useSharedValue(0);
  const [showInitialLoadingContent, setShowInitialLoadingContent] = useState(true);

  const animatedInitialLoadingStyle = useAnimatedStyle(() => {
    return {
      opacity: initialOpacity.value,
      transform: [{ scale: initialScale.value }, { translateY: initialTranslateY.value }],
    };
  });

  useEffect(() => {
    if (loadingInitialData) {
      setShowInitialLoadingContent(true);
      initialOpacity.value = withTiming(1, { duration: 300 });
      initialScale.value = withTiming(1, { duration: 300 });
      initialTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      initialOpacity.value = withTiming(0, { duration: 400 }, (isFinished) => {
        if (isFinished) {
          runOnJS(setShowInitialLoadingContent)(false);
        }
      });
      initialScale.value = withTiming(0.8, { duration: 400 });
      initialTranslateY.value = withTiming(50, { duration: 400 });
    }
  }, [loadingInitialData]);

  const fetchWorkingHours = useCallback(async () => {
    try {
        const docRef = doc(db, 'ShopSchedules', 'shop_schedule');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data().days as WorkingHours;
            setWorkingHours(data);
        } else {
            console.log("No se encontró el documento de horarios. Usando horarios por defecto.");
        }
    } catch (error) {
        console.error("Error al obtener los horarios de la tienda:", error);
    }
  }, []);

  useEffect(() => {
    fetchWorkingHours();
  }, [fetchWorkingHours]);

  const fetchUserName = useCallback(async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'Usuarios', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserName(data?.nombre || '');
      }
    } catch (e) {
      console.error('Error al cargar nombre usuario:', e);
    }
  }, [user]);

  const fetchLastReserva = useCallback(async () => {
  if (!user) return;
  try {
    const q = query(collection(db, 'Reservas'), where('clienteId', '==', user.uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const reservas = snapshot.docs.map(d => d.data());
      reservas.sort((a, b) => {
        const fechaA = a.creadoEn?.toDate ? a.creadoEn.toDate() : new Date(0);
        const fechaB = b.creadoEn?.toDate ? b.creadoEn.toDate() : new Date(0);
        return fechaB.getTime() - fechaA.getTime();
      });
      const lastReservaData = reservas[0];
      setLastReserva({
        peluqueroId: lastReservaData.peluqueroId,
        servicioId: lastReservaData.servicioId,
        nombreReserva: lastReservaData.nombreReserva,
      });
    }
  } catch (e) {
    console.error('Error cargando última reserva:', e);
  }
}, [user]);

  const fetchData = useCallback(async () => {
    setLoadingInitialData(true);
    try {
      const [peluquerosSnapshot, serviciosSnapshot] = await Promise.all([
        getDocs(collection(db, 'Peluqueros')),
        getDocs(collection(db, 'Servicios')),
      ]);

      const pelus = peluquerosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Peluquero[];
      setPeluqueros(pelus);
      if (pelus.length && !peluqueroSelected) setPeluqueroSelected(pelus[0].id);

      const servs = serviciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Servicio[];
      setServicios(servs);
      if (servs.length && !servicioSelected) setServicioSelected(servs[0].id);

      await fetchLastReserva();
    } catch (e) {
      console.error('Error cargando datos iniciales:', e);
      Alert.alert('Error', 'No se pudieron cargar los datos iniciales (peluqueros/servicios).');
    } finally {
      setLoadingInitialData(false);
    }
  }, [peluqueroSelected, servicioSelected, fetchLastReserva]);

  const fetchReservasOcupadas = useCallback(async () => {
    if (!peluqueroSelected || !fecha) {
      setHorasOcupadas([]);
      return;
    }
    setLoadingReservas(true);
    try {
      const fechaStr = dayjs(fecha).format('YYYY-MM-DD');
      const q = query(
        collection(db, 'Reservas'),
        where('peluqueroId', '==', peluqueroSelected),
        where('fecha', '==', fechaStr),
        where('estado', '!=', 'cancelada')
      );
      const snapshot = await getDocs(q);
      const ocupadas: string[] = snapshot.docs.map(doc => doc.data().hora);
      setHorasOcupadas(ocupadas);

      if (horaSelected && ocupadas.includes(horaSelected)) {
        setHoraSelected('');
      }
    } catch (e) {
      console.error('Error cargando reservas ocupadas:', e);
      Alert.alert('Error', 'No se pudieron cargar las horas ocupadas.');
    } finally {
      setLoadingReservas(false);
    }
  }, [peluqueroSelected, fecha, horaSelected]);

  useEffect(() => {
    fetchUserName();
  }, [fetchUserName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (peluqueroSelected) {
      if (!dayjs(fecha).isSame(dayjs(), 'day')) {
        setFecha(dayjs().toDate());
      }
    }
  }, [peluqueroSelected]);

  useEffect(() => {
    const generateHoursForDay = (date: Date) => {
      const dayOfWeek = dayjs(date).day();

      const firebaseDayIndex = dayOfWeek;
      const daySchedule = workingHours[String(firebaseDayIndex)];
      const currentHours: string[] = [];
      const now = dayjs();

      if (!daySchedule || daySchedule.length === 0) {
        return [];
      }

      daySchedule.forEach((slot: WorkingHoursEntry) => {
        let currentTime = dayjs(date).hour(parseInt(slot.start.substring(0, 2))).minute(parseInt(slot.start.substring(3, 5)));
        const endTime = dayjs(date).hour(parseInt(slot.end.substring(0, 2))).minute(parseInt(slot.end.substring(3, 5)));

        while (currentTime.isBefore(endTime) || currentTime.isSame(endTime, 'minute')) {
          const hourString = currentTime.format('HH:mm');
          if (dayjs(date).isAfter(now, 'day') || currentTime.isSameOrAfter(now, 'minute')) {
            currentHours.push(hourString);
          }
          currentTime = currentTime.add(30, 'minute');
        }
      });

      return Array.from(new Set(currentHours)).sort();
    };

    setHorasDisponibles(generateHoursForDay(fecha));
    setHoraSelected('');
  }, [fecha, workingHours]);

  useEffect(() => {
    const generateVisibleDates = () => {
      const startOfMonth = dayjs(fecha).startOf('month');
      const endOfMonth = dayjs(fecha).endOf('month');
      const newDates: Date[] = [];

      let currentDay = startOfMonth;
      while (currentDay.isSame(endOfMonth, 'day') || currentDay.isBefore(endOfMonth)) {
        newDates.push(currentDay.toDate());
        currentDay = currentDay.add(1, 'day');
      }

      for (let i = 1; i <= 7; i++) {
        newDates.push(endOfMonth.add(i, 'day').toDate());
      }

      setDates(newDates);

      setTimeout(() => {
        const index = newDates.findIndex(d =>
          dayjs(d).isSame(startOfMonth, 'day')
        );
        if (index !== -1) {
          flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
        }
      }, 100);
    };

    generateVisibleDates();
  }, [dayjs(fecha).month()]);

  useEffect(() => {
    fetchReservasOcupadas();
  }, [fetchReservasOcupadas]);

  const confirmReserva = useCallback(async (reservaId: string) => {
    try {
      const reservaRef = doc(db, 'Reservas', reservaId);
      await updateDoc(reservaRef, { estado: 'confirmada' });
      Alert.alert('Cita Confirmada', 'Tu cita ha sido confirmada correctamente.');
    } catch (e) {
      console.error('Error al confirmar la cita:', e);
      Alert.alert('Error', 'No se pudo confirmar la cita. Inténtalo de nuevo.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de Notificación Denegado', 'No podrás recibir notificaciones. Por favor, habilítalas en la configuración de tu teléfono.');
        return;
      }
    })();
    
    Notifications.setNotificationCategoryAsync('reserva_recordatorio', [
        {
            identifier: 'confirm_reserva',
            buttonTitle: 'Confirmar Cita',
            options: {
                isDestructive: false,
                opensAppToForeground: true,
            },
        },
    ]);

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { actionIdentifier } = response;
      const { reservaId } = response.notification.request.content.data;

      if (actionIdentifier === 'confirm_reserva' && reservaId) {
        confirmReserva(reservaId as string);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [confirmReserva]);

  const handleSelectHour = (hour: string) => {
    if (horasOcupadas.includes(hour)) {
      Alert.alert('Hora Ocupada', 'La hora seleccionada ya está reservada. Por favor, elige otra.');
      setHoraSelected('');
    } else {
      setHoraSelected(hour);
    }
  };
  
  // FUNCIÓN MODIFICADA PARA VERIFICAR EL NUEVO LÍMITE
  const checkUserReservationLimit = async (userId: string) => {
    const timeThreshold = dayjs().subtract(TIME_WINDOW_MINUTES, 'minute').toDate();
    
    const q = query(
        collection(db, 'Reservas'),
        where('clienteId', '==', userId),
        where('creadoEn', '>=', timeThreshold)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.size >= RESERVA_LIMIT) {
        Alert.alert(
            'Límite de Reservas Excedido',
            `Solo puedes hacer un máximo de ${RESERVA_LIMIT} reservas en ${TIME_WINDOW_MINUTES} minutos.`,
            [{ text: "Entendido" }]
        );
        return false;
    }
    
    return true;
  };

  const handleReserva = async () => {
    const today = dayjs().startOf('day');
    const selectedDateDayjs = dayjs(fecha).startOf('day');
    const [hora, minuto] = horaSelected.split(':').map(Number);

    if (selectedDateDayjs.isBefore(today)) {
      Alert.alert('Error', 'No puedes reservar una fecha que ya ha pasado.');
      return;
    }
    
    const finalNombreReserva = nombreReserva.trim() === '' ? userName : nombreReserva.trim();

    if (!finalNombreReserva) {
        Alert.alert('Error', 'No se puede crear una reserva sin un nombre.');
        return;
    }

    if (!peluqueroSelected) {
      Alert.alert('Error', 'Selecciona un peluquero.');
      return;
    }
    if (!servicioSelected) {
      Alert.alert('Error', 'Selecciona un servicio.');
      return;
    }
    if (!horaSelected) {
      Alert.alert('Error', 'Selecciona una hora disponible.');
      return;
    }
    
    // Nueva validación para limitar las reservas
    if (auth.currentUser) {
      const canReserve = await checkUserReservationLimit(auth.currentUser.uid);
      if (!canReserve) {
        return;
      }
    }


    setSubmittingReserva(true);

    try {
      const fechaStr = dayjs(fecha).format('YYYY-MM-DD');
      const q = query(
        collection(db, 'Reservas'),
        where('peluqueroId', '==', peluqueroSelected),
        where('fecha', '==', fechaStr),
        where('hora', '==', horaSelected),
        where('estado', '!=', 'cancelada')
      );
      const existingReservas = await getDocs(q);
      if (!existingReservas.empty) {
        Alert.alert('Hora Ocupada', 'La hora seleccionada ya no está disponible. Por favor, elige otra.');
        fetchReservasOcupadas();
        return;
      }

      const reservaData = {
        clienteId: auth.currentUser?.uid,
        clienteNombre: userName,
        nombreReserva: finalNombreReserva,
        peluqueroId: peluqueroSelected,
        servicioId: servicioSelected,
        fecha: fechaStr,
        hora: horaSelected,
        estado: 'pendiente',
        creadoEn: serverTimestamp(),
      };

      const reservaRef = await addDoc(collection(db, 'Reservas'), reservaData);

      if (auth.currentUser) {
        const userRef = doc(db, 'Usuarios', auth.currentUser.uid);
        await updateDoc(userRef, {
          reservas: arrayUnion(reservaRef.id)
        });
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Reserva Creada!",
          body: `Tu reserva con ${finalNombreReserva} ha sido creada para el ${dayjs(fecha).format('DD-MM-YYYY')} a las ${horaSelected}.`,
        },
        trigger: null,
      });

      const citaDateTime = dayjs(fecha)
        .hour(parseInt(horaSelected.substring(0, 2)))
        .minute(parseInt(horaSelected.substring(3, 5)));

      let triggerDate: Date;

      if (citaDateTime.hour() < 14) {
        triggerDate = citaDateTime.subtract(1, 'day').hour(18).minute(0).toDate();
      } else {
        triggerDate = citaDateTime.subtract(5, 'hour').toDate();
      }

      const scheduledTrigger = {
        type: 'date',
        date: triggerDate,
      } as Notifications.NotificationTriggerInput;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Recordatorio de Reserva!",
          body: `Recuerda tu reserva para hoy, ${dayjs(fecha).format('DD-MM-YYYY')} a las ${horaSelected}.`,
          data: { reservaId: reservaRef.id },
          categoryIdentifier: 'reserva_recordatorio',
        },
        trigger: scheduledTrigger,
      });

      Alert.alert('Reserva creada', 'Tu reserva ha sido registrada correctamente.');
      setNombreReserva('');
      setFecha(dayjs().toDate());
      setHoraSelected('');
      fetchReservasOcupadas();
      fetchLastReserva();
    } catch (e) {
      console.error('Error creando reserva:', e);
      Alert.alert('Error', 'No se pudo crear la reserva. Inténtalo de nuevo.');
    } finally {
      setSubmittingReserva(false);
    }
  };

  const handleRepeatLastCita = () => {
    if (lastReserva) {
      setNombreReserva(lastReserva.nombreReserva);
      setPeluqueroSelected(lastReserva.peluqueroId);
      setServicioSelected(lastReserva.servicioId);
      Alert.alert(
        'Última Cita Cargada',
        `Peluquero: ${peluqueros.find(p => p.id === lastReserva.peluqueroId)?.nombre}\nServicio: ${servicios.find(s => s.id === lastReserva.servicioId)?.nombre}`
      );
    }
  };

  const renderContent = () => {
    if (showInitialLoadingContent) {
      return (
        <Animated.View style={[styles.loadingContainer, animatedInitialLoadingStyle]}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.loadingImage}
            resizeMode="contain"
          />
        </Animated.View>
      );
    }

    if (!peluqueros.length || !servicios.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="alert" size={60} color="#ffc107" />
          <Text style={styles.emptyStateText}>
            No se pueden crear reservas en este momento.
            {'\n'}Asegúrate de que haya peluqueros y servicios registrados.
          </Text>
          <Pressable style={styles.refreshButton} onPress={fetchData}>
            <Text style={styles.refreshButtonText}>Recargar</Text>
          </Pressable>
        </View>
      );
    }

    const currentPeluqueroName = peluqueros.find(p => p.id === peluqueroSelected)?.nombre || 'Seleccionar...';
    const currentServicioName = servicios.find(s => s.id === servicioSelected)?.nombre || 'Seleccionar...';
    const currentMonthYear = dayjs(fecha).format('MMMM YYYY');

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reservar</Text>
        </View>

        {lastReserva ? (
          <Pressable
            style={styles.repeatButton}
            onPress={handleRepeatLastCita}
          >
            <MaterialCommunityIcons name="history" size={20} color="#fff" />
            <Text style={styles.dateButtonText}>Repetir última cita</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.repeatButton, { backgroundColor: '#aaa' }]}
            disabled
          >
            <MaterialCommunityIcons name="history" size={20} color="#fff" />
            <Text style={styles.dateButtonText}>No tienes citas anteriores</Text>
          </Pressable>
        )}


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles de la Reserva</Text>
          <Text style={styles.label}>Nombre de la persona a reservar (opcional):</Text>
          <TextInput
            style={styles.input}
            value={nombreReserva}
            onChangeText={setNombreReserva}
            placeholder="Tu nombre o el de la persona que reserva"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selecciona Peluquero</Text>
          <FlatList
            data={peluqueros}
            renderItem={({ item }) => {
              const isSelected = item.id === peluqueroSelected;
              return (
                <Pressable
                  style={[
                    styles.peluqueroItem,
                    isSelected && styles.peluqueroItemSelected,
                  ]}
                  onPress={() => setPeluqueroSelected(item.id)}
                >
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.peluqueroImage} />
                  ) : (
                    <MaterialCommunityIcons name="account-circle" size={50} color="#6c757d" />
                  )}
                  <Text style={[
                    styles.peluqueroName,
                    isSelected && styles.peluqueroNameSelected,
                  ]}>
                    {item.nombre}
                  </Text>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peluqueroListContainer}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selecciona Servicio</Text>
          <FlatList
            data={servicios}
            renderItem={({ item }) => {
              const isSelected = item.id === servicioSelected;
              return (
                <Pressable
                  style={[
                    styles.servicioItem,
                    isSelected && styles.servicioItemSelected,
                  ]}
                  onPress={() => setServicioSelected(item.id)}
                >
                  <MaterialCommunityIcons name="scissors-cutting" size={40} color="#6c757d" style={styles.servicioIcon} />
                  <Text style={[
                    styles.servicioName,
                    isSelected && styles.servicioNameSelected,
                  ]}>
                    {item.nombre}
                  </Text>
                  <Text style={[
                    styles.servicioPrice,
                    isSelected && styles.servicioPriceSelected,
                  ]}>
                    €{item.precio.toFixed(2)}
                  </Text>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicioListContainer}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fecha y Hora</Text>

          <View style={styles.datePickerContainer}>
            <Pressable
              onPress={() => {
                const ahora = dayjs();
                const mesActual = ahora.startOf('month');
                const mesSeleccionado = dayjs(fecha).startOf('month');

                if (!mesSeleccionado.isSame(mesActual, 'month') && !mesSeleccionado.isBefore(mesActual)) {
                  const newMonth = mesSeleccionado.subtract(1, 'month');
                  setFecha(newMonth.toDate());
                }
              }}
              style={[
                styles.dateNavButton,
                (dayjs(fecha).isSame(dayjs(), 'month') || dayjs(fecha).isBefore(dayjs(), 'month')) && { opacity: 0.3 }
              ]}
              disabled={dayjs(fecha).isSame(dayjs(), 'month') || dayjs(fecha).isBefore(dayjs(), 'month')}
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
            </Pressable>
            <Text style={styles.monthYearText}>{currentMonthYear}</Text>
            <Pressable
              onPress={() => {
                const newMonth = dayjs(fecha).add(1, 'month');
                setFecha(newMonth.toDate());
              }}
              style={styles.dateNavButton}
            >
              <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
            </Pressable>
          </View>

          <FlatList
            ref={flatListRef}
            data={datesFiltradas}
            renderItem={({ item, index }) => {
              const isSelected = dayjs(item).isSame(fecha, 'day');
              const isPastDate = dayjs(item).startOf('day').isBefore(dayjs().startOf('day'));
              return (
                <Pressable
                  style={[
                    styles.dateItem,
                    isSelected && styles.dateItemSelected,
                    isPastDate && styles.dateItemDisabled,
                  ]}
                  onPress={() => {
                    if (!isPastDate) {
                      setFecha(item);
                      setHoraSelected('');
                    }
                  }}
                  disabled={isPastDate}
                >
                  <Text style={[
                    styles.dateText,
                    isSelected && styles.dateTextSelected,
                    isPastDate && styles.dateTextDisabled,
                  ]}>
                    {dayjs(item).format('DD')}
                  </Text>
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isPastDate && styles.dayTextDisabled,
                  ]}>
                    {dayjs(item).format('ddd').toUpperCase()}
                  </Text>
                </Pressable>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateListContainer}
            getItemLayout={(data, index) => (
              { length: (width / 7 - 10) + 10, offset: ((width / 7 - 10) + 10) * index, index }
            )}
            onScrollToIndexFailed={() => {}}
          />

          <Text style={styles.label}>HORAS</Text>
          <TimeSlotPicker
            horasDisponibles={horasDisponibles}
            horasOcupadas={horasOcupadas}
            horaSelected={horaSelected}
            onSelectHour={handleSelectHour}
            loading={loadingReservas}
            currentDate={fecha}
          />
        </View>

        {(fecha && horaSelected) && (
          <View style={styles.bookingSummaryCard}>
            <MaterialCommunityIcons name="calendar-check" size={24} style={styles.bookingSummaryIcon} />
            <Text style={styles.bookingSummaryText}>
              {dayjs(fecha).format('dddd, MMMM D')} - {horaSelected}
            </Text>
          </View>
        )}


        <Pressable
          style={({ pressed }) => [
            styles.reserveButton,
            pressed && styles.reserveButtonPressed,
            submittingReserva && styles.reserveButtonDisabled,
          ]}
          onPress={handleReserva}
          disabled={submittingReserva || loadingReservas || !horaSelected}
        >
          {submittingReserva ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.reserveButtonText}>Reservar</Text>
          )}
        </Pressable>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
    </SafeAreaView>
  );
}