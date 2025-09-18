import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el locale español
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

dayjs.extend(localizedFormat);
dayjs.locale('es');

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

// Importa tus estilos y colores generales
import { ClientColors, styles } from '../../styles/index.cliente.styles'; // Asegúrate de que esta ruta sea correcta
// Importa los estilos específicos de esta pantalla
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { localStyles } from '../../styles/controlHoras.styles'; // Metro is looking for 'controlHoras.styles.ts' in this same folder

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  [key: number]: TimeSlot[]; // 0 for Sunday, 1 for Monday, etc.
}

const defaultWorkingHours: DaySchedule = {
  0: [], // Domingo: Cerrado
  1: [{ start: '09:30', end: '13:30' }, { start: '16:00', end: '21:00' }], // Lunes
  2: [{ start: '09:30', end: '13:30' }, { start: '16:00', end: '21:00' }], // Martes
  3: [{ start: '09:30', end: '13:30' }, { start: '16:00', end: '21:00' }], // Miércoles
  4: [{ start: '09:30', end: '13:30' }, { start: '16:00', end: '21:00' }], // Jueves
  5: [{ start: '09:30', end: '13:30' }, { start: '16:00', end: '21:00' }], // Viernes
  6: [{ start: '09:00', end: '14:00' }], // Sábado
};

const AdminHourManagementScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [shopSchedule, setShopSchedule] = useState<DaySchedule>(defaultWorkingHours);
  const [selectedDay, setSelectedDay] = useState<number>(dayjs().day()); // Día actual por defecto
  const [tempNewSlotStart, setTempNewSlotStart] = useState('');
  const [tempNewSlotEnd, setTempNewSlotEnd] = useState('');
  const [isDayOff, setIsDayOff] = useState(false); // Para gestionar si el día está cerrado

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Cargar el horario desde Firebase al inicio
  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'ShopSchedules', 'shop_schedule');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convertir keys de string a number
        const loadedSchedule: DaySchedule = {};
        for (const key in data.days) {
          loadedSchedule[parseInt(key)] = data.days[key];
        }
        setShopSchedule(loadedSchedule);
        // Verificar si el día seleccionado está marcado como cerrado
        setIsDayOff(loadedSchedule[selectedDay]?.length === 0);
      } else {
        // Si no existe, guardar el horario predeterminado
        await setDoc(docRef, { days: defaultWorkingHours });
        setShopSchedule(defaultWorkingHours);
        setIsDayOff(defaultWorkingHours[selectedDay]?.length === 0);
      }
    } catch (e) {
      console.error('Error al cargar o inicializar horario:', e);
      Alert.alert('Error', 'No se pudo cargar el horario. Inténtalo de nuevo.');
      setShopSchedule(defaultWorkingHours); // Fallback a default
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  // Guardar el horario en Firebase
  const saveSchedule = useCallback(async (updatedSchedule: DaySchedule) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'ShopSchedules', 'shop_schedule');
      // Convertir keys de number a string para Firestore si es necesario
      const scheduleToSave: { [key: string]: TimeSlot[] } = {};
      for (const key in updatedSchedule) {
        scheduleToSave[key.toString()] = updatedSchedule[key];
      }
      await setDoc(docRef, { days: scheduleToSave }, { merge: true });
      Alert.alert('Éxito', 'Horario guardado correctamente.');
    } catch (e) {
      console.error('Error al guardar horario:', e);
      Alert.alert('Error', 'No se pudo guardar el horario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Actualizar el estado de isDayOff cuando cambia el día seleccionado o el horario
  useEffect(() => {
    setIsDayOff(shopSchedule[selectedDay]?.length === 0);
  }, [selectedDay, shopSchedule]);

  const handleAddSlot = () => {
    if (!tempNewSlotStart || !tempNewSlotEnd) {
      Alert.alert('Error', 'Introduce una hora de inicio y fin.');
      return;
    }

    const startHour = dayjs().hour(parseInt(tempNewSlotStart.substring(0, 2))).minute(parseInt(tempNewSlotStart.substring(3, 5)));
    const endHour = dayjs().hour(parseInt(tempNewSlotEnd.substring(0, 2))).minute(parseInt(tempNewSlotEnd.substring(3, 5)));

    if (!startHour.isValid() || !endHour.isValid() || startHour.isSameOrAfter(endHour)) {
      Alert.alert('Error', 'Formato de hora inválido (HH:mm) o la hora de inicio es posterior o igual a la de fin.');
      return;
    }

    const newSlot: TimeSlot = {
      start: startHour.format('HH:mm'),
      end: endHour.format('HH:mm'),
    };

    const updatedDaySchedule = [...(shopSchedule[selectedDay] || []), newSlot]
      .sort((a, b) => dayjs(a.start, 'HH:mm').diff(dayjs(b.start, 'HH:mm')));

    const newShopSchedule = {
      ...shopSchedule,
      [selectedDay]: updatedDaySchedule,
    };
    setShopSchedule(newShopSchedule);
    saveSchedule(newShopSchedule);
    setTempNewSlotStart('');
    setTempNewSlotEnd('');
    setIsDayOff(false); // Si se añade un slot, ya no es un día cerrado
  };

  const handleRemoveSlot = (slotToRemove: TimeSlot) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de que quieres eliminar la franja ${slotToRemove.start} - ${slotToRemove.end}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedDaySchedule = (shopSchedule[selectedDay] || []).filter(
              (slot) => !(slot.start === slotToRemove.start && slot.end === slotToRemove.end)
            );
            const newShopSchedule = {
              ...shopSchedule,
              [selectedDay]: updatedDaySchedule,
            };
            setShopSchedule(newShopSchedule);
            saveSchedule(newShopSchedule);
            // Si no quedan slots, marcar como día cerrado
            if (updatedDaySchedule.length === 0) {
              setIsDayOff(true);
            }
          },
        },
      ]
    );
  };

  const handleToggleDayOff = (value: boolean) => {
    setIsDayOff(value);
    const newShopSchedule = {
      ...shopSchedule,
      [selectedDay]: value ? [] : defaultWorkingHours[selectedDay] || [], // Si es día libre, vaciar; si no, restaurar default o dejar vacío
    };
    setShopSchedule(newShopSchedule);
    saveSchedule(newShopSchedule);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, localStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={ClientColors.accentPrimary} />
        <Text style={localStyles.loadingText}>Cargando horario...</Text>
      </SafeAreaView>
    );
  }

  const currentDaySchedule = shopSchedule[selectedDay] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={localStyles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestión de Horas</Text>
        </View>
        <Pressable
        onPress={() => router.back()} // MODIFICADO: Uso de router.back()
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS status bar
          left: 20,
          zIndex: 1, // Ensure the button is on top
        }}
      >
        <Ionicons name="chevron-back-outline" size={28} color="#9F7AEA" />
      </Pressable>

        {/* Selector de Día */}
        <View style={localStyles.card}>
          <Text style={localStyles.cardTitle}>Selecciona el Día</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={localStyles.daySelectorContainer}>
            {daysOfWeek.map((dayName, index) => (
              <Pressable
                key={index}
                style={[
                  localStyles.dayButton,
                  selectedDay === index && localStyles.dayButtonSelected,
                ]}
                onPress={() => setSelectedDay(index)}
              >
                <Text style={[
                  localStyles.dayButtonText,
                  selectedDay === index && localStyles.dayButtonTextSelected,
                ]}>
                  {dayName}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Horario del Día Seleccionado */}
        <View style={localStyles.card}>
          <Text style={localStyles.cardTitle}>Horario para {daysOfWeek[selectedDay]}</Text>

          <View style={localStyles.dayOffToggleContainer}>
            <Text style={localStyles.dayOffToggleText}>Día libre / Cerrado</Text>
            <Switch
              onValueChange={handleToggleDayOff}
              value={isDayOff}
              trackColor={{ false: ClientColors.textMedium, true: ClientColors.accentDanger }}
              thumbColor={isDayOff ? ClientColors.textLight : ClientColors.textLight}
            />
          </View>

          {!isDayOff ? (
            <>
              {currentDaySchedule.length === 0 ? (
                <Text style={localStyles.noHoursText}>No hay franjas horarias definidas para este día. Añade una.</Text>
              ) : (
                <View>
                  {currentDaySchedule.map((slot, index) => (
                    <View key={index} style={localStyles.slotItem}>
                      <Text style={localStyles.slotText}>{slot.start} - {slot.end}</Text>
                      <Pressable onPress={() => handleRemoveSlot(slot)} style={localStyles.removeButton}>
                        <MaterialCommunityIcons name="close-circle" size={24} color={ClientColors.accentDanger} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <Text style={localStyles.sectionLabel}>Añadir Nueva Franja:</Text>
              <View style={localStyles.newSlotContainer}>
                <TextInput
                  style={localStyles.timeInput}
                  placeholder="HH:mm Inicio"
                  placeholderTextColor="#888"
                  value={tempNewSlotStart}
                  onChangeText={setTempNewSlotStart}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <Text style={localStyles.timeSeparator}>-</Text>
                <TextInput
                  style={localStyles.timeInput}
                  placeholder="HH:mm Fin"
                  placeholderTextColor="#888"
                  value={tempNewSlotEnd}
                  onChangeText={setTempNewSlotEnd}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <Pressable onPress={handleAddSlot} style={localStyles.addButton}>
                  <MaterialCommunityIcons name="plus-circle" size={40} color={ClientColors.accentPrimary} />
                </Pressable>
              </View>
            </>
          ) : (
            <Text style={localStyles.closedDayText}>Este día está marcado como cerrado.</Text>
          )}
        </View>

        {/* Sección para gestión de horas por peluquero (futura expansión) */}
        <View style={localStyles.card}>
          <Text style={localStyles.cardTitle}>Gestión por Peluquero (Próximamente)</Text>
          <Text style={localStyles.infoText}>
            Esta sección permitirá definir horarios específicos o excepciones para peluqueros individuales.
            Actualmente, el horario gestionado es el de toda la barbería.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHourManagementScreen;