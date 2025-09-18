import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../lib/firebaseConfig";
import { styles } from "../../styles/index.admin.styles";
import EditReservaModal from "../components/EditReservaModel";
import TicketModal from "../components/TicketModal";
import {
  Peluquero,
  Reserva,
  Servicio,
  ShopSchedule,
  UserData,
  WorkingHoursEntry,
  getDurationInMinutes,
} from "../utils/helpers";

dayjs.locale("es");
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

export default function AgendaScreen() {
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().startOf("day")
  );
  const [error, setError] = useState<string | null>(null);
  const [loadingPeluqueros, setLoadingPeluqueros] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [showMainDatePicker, setShowMainDatePicker] = useState(false);
  const [showCrearFechaDatePicker, setShowCrearFechaDatePicker] =
    useState(false);
  const [usersData, setUsersData] = useState<{ [key: string]: UserData }>({});

  const [workingHours, setWorkingHours] = useState<
    Record<string, WorkingHoursEntry[]>
  >({});
  const [generatedHours, setGeneratedHours] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<
    Record<string, { start: string; end: string }[]>
  >({});

  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [crearPeluqueroId, setCrearPeluqueroId] = useState<string>("");
  const [crearServicioId, setCrearServicioId] = useState<string>("");
  const [crearClienteNombre, setCrearClienteNombre] = useState<string>("");
  const [crearClienteTelefono, setCrearClienteTelefono] = useState<string>("");
  const [crearFecha, setCrearFecha] = useState<Date>(new Date());
  const [crearHora, setCrearHora] = useState<string>("09:00");
  const [crearEstado, setCrearEstado] = useState<
    "pendiente" | "completada" | "cancelada" | "no asistido"
  >("pendiente");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );

  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<Reserva | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showCrearHoraPicker, setShowCrearHoraPicker] = useState(false);
  const [outOfHoursReservations, setOutOfHoursReservations] = useState<
    Reserva[]
  >([]);
  const [selectedCrearFecha, setSelectedCrearFecha] = useState(dayjs());
  const availableDates = Array.from({ length: 7 }, (_, i) =>
    dayjs().add(i, "day")
  );

  const cellHeights = useRef<{ [key: string]: number }>({});
  const [showOutOfHoursTimePicker, setShowOutOfHoursTimePicker] =
    useState(false);

  const fetchWorkingHours = async () => {
    try {
      const docRef = doc(db, "ShopSchedules", "shop_schedule");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ShopSchedule;
        setWorkingHours(data.days);
      } else {
        console.warn("Documento de horarios no encontrado.");
      }
    } catch (err) {
      console.error("Error al cargar horarios de la tienda:", err);
    }
  };

  const generateHoursForDay = (date: dayjs.Dayjs) => {
    const dayIndex = date.day().toString();
    const scheduleForDay = workingHours[dayIndex];
    const hours: string[] = [];

    if (!scheduleForDay) {
      return [];
    }

    scheduleForDay.forEach((slot) => {
      let current = dayjs(date.format("YYYY-MM-DD") + "T" + slot.start);
      const end = dayjs(date.format("YYYY-MM-DD") + "T" + slot.end);

      while (current.isBefore(end)) {
        hours.push(current.format("HH:mm"));
        current = current.add(30, "minutes");
      }
    });

    return hours;
  };

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  useEffect(() => {
    if (Object.keys(workingHours).length > 0) {
      setGeneratedHours(generateHoursForDay(fechaSeleccionada));
    }
  }, [fechaSeleccionada, workingHours]);

  useEffect(() => {
    setLoadingPeluqueros(true);
    const unsubPeluqueros = onSnapshot(
      collection(db, "Peluqueros"),
      (snapshot) => {
        try {
          const pelus: Peluquero[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, nombre: data.nombre || "Sin nombre" };
          });
          setPeluqueros(pelus);
          setError(null);
          if (pelus.length > 0 && !crearPeluqueroId) {
            setCrearPeluqueroId(pelus[0].id);
          }
        } catch (err: any) {
          setError(`Error cargando peluqueros: ${err.message}`);
          console.error("Error cargando peluqueros:", err);
        } finally {
          setLoadingPeluqueros(false);
        }
      },
      (error) => {
        setError(`Error en listener de peluqueros: ${error.message}`);
        console.error("Error en listener de peluqueros:", error);
        setLoadingPeluqueros(false);
      }
    );

    const unsubServicios = onSnapshot(
      collection(db, "Servicios"),
      (snapshot) => {
        try {
          const servs: Servicio[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nombre: data.nombre || "Sin nombre",
              precio: data.precio || 0,
              duracion: data.duracion || "30 mins",
            };
          }) as Servicio[];
          setServicios(servs);
          if (servs.length > 0 && !crearServicioId) {
            setCrearServicioId(servs[0].id);
          }
        } catch (err: any) {
          console.error("Error procesando servicios:", err);
        }
      }
    );

    const unsubUsers = onSnapshot(collection(db, "Usuarios"), (snapshot) => {
      try {
        const fetchedUsers: { [key: string]: UserData } = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          fetchedUsers[doc.id] = {
            id: doc.id,
            nombre: data.nombre || "Desconocido",
            telefono: data.telefono || undefined,
            reputacion:
              (data.reputacion as "buena" | "regular" | "mala") || "regular",
          };
        });
        setUsersData(fetchedUsers);
      } catch (err) {
        console.error("Error al cargar datos de usuarios:", err);
      }
    });

    return () => {
      unsubPeluqueros();
      unsubServicios();
      unsubUsers();
    };
  }, [crearPeluqueroId, crearServicioId]);

  useEffect(() => {
    setLoadingReservas(true);
    const fechaFormateada = fechaSeleccionada.format("YYYY-MM-DD");
    const q = query(
      collection(db, "Reservas"),
      where("fecha", "==", fechaFormateada),
      where("estado", "!=", "cancelada")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        try {
          const res: Reserva[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const clienteTelefono =
              data.clienteId && usersData[data.clienteId]?.telefono
                ? usersData[data.clienteId].telefono
                : data.clienteTelefono || undefined;
            return {
              id: doc.id,
              clienteNombre:
                data.nombreReserva || data.clienteNombre || "Sin nombre",
              peluqueroId: data.peluqueroId || "",
              fecha: data.fecha || "",
              hora: data.hora || "",
              clienteId: data.clienteId || undefined,
              clienteTelefono: clienteTelefono,
              servicioId: data.servicioId || "",
              estado: data.estado || "pendiente",
              metodoPago: data.metodoPago || undefined,
            };
          });

          res.sort((a, b) => {
            const parseHora = (h: string) => {
              const [hh, mm] = h.split(":").map(Number);
              return hh * 60 + mm;
            };
            return parseHora(a.hora) - parseHora(b.hora);
          });

          setReservas(res);
          setError(null);
        } catch (err: any) {
          setError(`Error cargando reservas: ${err.message}`);
          console.error("Error cargando reservas:", err);
        } finally {
          setLoadingReservas(false);
        }
      },
      (error) => {
        setError(`Error en listener de reservas: ${error.message}`);
        console.error("Error en listener de reservas:", error);
        setLoadingReservas(false);
      }
    );

    return unsub;
  }, [fechaSeleccionada, usersData]);

  const onChangeFecha = (event: any, selectedDate?: Date | undefined) => {
    setShowMainDatePicker(false);
    if (selectedDate) {
      setFechaSeleccionada(dayjs(selectedDate).startOf("day"));
    }
  };

  const handleClienteNombreChange = (text: string) => {
    setCrearClienteNombre(text);
    setSelectedUserId(undefined);
    if (text.length > 0) {
      const lowercasedText = text.toLowerCase();
      const matches = Object.entries(usersData)
        .filter(([id, user]) =>
          user.nombre.toLowerCase().includes(lowercasedText)
        )
        .map(([_, user]) => user);
      setFilteredUsers(matches);
      setShowUserSuggestions(true);
    } else {
      setFilteredUsers([]);
      setShowUserSuggestions(false);
    }
  };

  const selectSuggestedUser = (user: {
    id: string;
    nombre: string;
    telefono?: string;
  }) => {
    setCrearClienteNombre(user.nombre);
    setCrearClienteTelefono(user.telefono || "");
    setSelectedUserId(user.id);
    setShowUserSuggestions(false);
    setFilteredUsers([]);
  };

  const guardarCitaRapida = async () => {
    console.log("--- Intentando guardar cita rápida ---");
    console.log("Peluquero:", crearPeluqueroId);
    console.log("Servicio:", crearServicioId);
    console.log("Cliente:", crearClienteNombre.trim());
    console.log("Hora:", crearHora);

    if (
      !crearPeluqueroId ||
      !crearServicioId ||
      !crearClienteNombre.trim() ||
      !crearHora.match(/^\d{2}:\d{2}$/)
    ) {
      Alert.alert(
        "Error de validación",
        "Por favor, asegúrate de que Peluquero, Servicio, Cliente y Hora están seleccionados o rellenados correctamente."
      );
      console.log(
        "Validación fallida: uno o más campos están vacíos o tienen un formato incorrecto."
      );
      return;
    }

    const selectedService = servicios.find((s) => s.id === crearServicioId);
    if (!selectedService) {
      Alert.alert("Error", "Servicio no encontrado.");
      console.log("Validación fallida: Servicio no encontrado en la lista.");
      return;
    }
    const durationInMinutes = getDurationInMinutes(selectedService.duracion);

    const nuevaReservaStartTime = dayjs(
      `${dayjs(crearFecha).format("YYYY-MM-DD")}T${crearHora}`
    );
    const nuevaReservaEndTime = nuevaReservaStartTime.add(
      durationInMinutes,
      "minutes"
    );

    const hasConflict = reservas.some((existingReserva) => {
      if (existingReserva.peluqueroId !== crearPeluqueroId) return false;
      const existingService = servicios.find(
        (s) => s.id === existingReserva.servicioId
      );
      if (!existingService) return false;
      const existingDurationInMinutes = getDurationInMinutes(
        existingService.duracion
      );
      const existingReservaStartTime = dayjs(
        `${existingReserva.fecha}T${existingReserva.hora}`
      );
      const existingReservaEndTime = existingReservaStartTime.add(
        existingDurationInMinutes,
        "minutes"
      );

      return (
        (nuevaReservaStartTime.isAfter(existingReservaStartTime) &&
          nuevaReservaStartTime.isBefore(existingReservaEndTime)) ||
        (nuevaReservaEndTime.isAfter(existingReservaStartTime) &&
          nuevaReservaEndTime.isBefore(existingReservaEndTime)) ||
        nuevaReservaStartTime.isSame(existingReservaStartTime) ||
        nuevaReservaEndTime.isSame(existingReservaEndTime)
      );
    });

    if (hasConflict) {
      Alert.alert(
        "Error de Agendamiento",
        "El peluquero seleccionado ya tiene una cita durante este tiempo."
      );
      console.log("Validación fallida: Conflicto de horario con otra cita.");
      return;
    }

    console.log("Validación completa. No se encontraron conflictos.");

    try {
      const nuevaReserva: Reserva = {
        id: "",
        peluqueroId: crearPeluqueroId,
        servicioId: crearServicioId,
        clienteNombre: crearClienteNombre.trim(),
        fecha: dayjs(crearFecha).format("YYYY-MM-DD"),
        hora: crearHora,
        estado: crearEstado,
        createdAt: new Date().toISOString(),
        ...(selectedUserId && { clienteId: selectedUserId }),
      };

      if (crearClienteTelefono.trim()) {
        nuevaReserva.clienteTelefono = crearClienteTelefono.trim();
      }

      console.log("Datos de la nueva reserva:", nuevaReserva);

      await addDoc(collection(db, "Reservas"), nuevaReserva);
      console.log("Reserva creada con éxito en Firebase.");

      setCrearPeluqueroId(peluqueros.length > 0 ? peluqueros[0].id : "");
      setCrearServicioId(servicios.length > 0 ? servicios[0].id : "");
      setCrearClienteNombre("");
      setCrearClienteTelefono("");
      setCrearFecha(new Date());
      setCrearHora("09:00");
      setCrearEstado("pendiente");
      setSelectedUserId(undefined);
      setModalCrearVisible(false);
      Alert.alert("Éxito", "Cita creada correctamente");
    } catch (error: any) {
      console.error("Error creando reserva:", error);
      Alert.alert(
        "Error de base de datos",
        `No se pudo crear la cita. Detalle: ${
          error.message || "Error desconocido"
        }`
      );
    }
  };

  const handleCrearCitaRapida = (peluqueroId: string, hora: string) => {
    setCrearPeluqueroId(peluqueroId);
    setCrearHora(hora);
    setCrearServicioId(servicios.length > 0 ? servicios[0].id : "");
    setCrearClienteNombre("");
    setCrearClienteTelefono("");
    setCrearFecha(fechaSeleccionada.toDate());
    setSelectedUserId(undefined);
    setModalCrearVisible(true);
    setShowOutOfHoursTimePicker(false); // Reset this state
  };

  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / 4.5;

  const guardarCambiosReserva = async (cambios: Partial<Reserva>) => {
    if (!reservaSeleccionada) return;

    try {
      const reservaRef = doc(db, "Reservas", reservaSeleccionada.id);
      await updateDoc(reservaRef, cambios);

      setModalVisible(false);
      setReservaSeleccionada(null);
      Alert.alert("Éxito", "Reserva actualizada correctamente.");
    } catch (error: any) {
      console.error("Error actualizando reserva:", error);
      Alert.alert(
        "Error",
        `No se pudo actualizar la reserva. Detalle: ${
          error.message || "Error desconocido"
        }`
      );
    }
  };

  const handlePrintTicket = (reserva: Reserva) => {
    const peluquero = peluqueros.find((p) => p.id === reserva.peluqueroId);
    const servicio = servicios.find((s) => s.id === reserva.servicioId);

    if (!peluquero || !servicio) {
      Alert.alert(
        "Error",
        "No se encontró la información completa para imprimir el ticket."
      );
      return;
    }

    setReservaSeleccionada(reserva);
    setTicketModalVisible(true);
  };

  const renderReserva = (reserva: Reserva) => {
    const servicio = servicios.find((s) => s.id === reserva.servicioId);

    if (!servicio) {
      return null;
    }

    const durationInMinutes = getDurationInMinutes(servicio.duracion);
    const height = (durationInMinutes / 30) * 60;

    let celdaStyle;
    switch (reserva.estado) {
      case "completada":
        celdaStyle = styles.celdaCompletada;
        break;
      case "cancelada":
        celdaStyle = styles.celdaCancelada;
        break;
      default:
        celdaStyle = styles.celdaReservada;
    }

    return (
      <Pressable
        key={reserva.id}
        onPress={() => {
          setReservaSeleccionada(reserva);
          setModalVisible(true);
        }}
        // Se aplica la altura calculada al componente que contiene la reserva
        style={[styles.singleReservationEntry, celdaStyle, { height }]}
      >
        <Text style={styles.reservaTexto}>{reserva.clienteNombre}</Text>
        <Text style={styles.reservaTexto}>{servicio.nombre}</Text>
        {reserva.clienteTelefono && (
          <Text style={styles.reservaTelefono}>{reserva.clienteTelefono}</Text>
        )}
      </Pressable>
    );
  };

  const getReservasForPeluqueroAndTime = (
    peluqueroId: string,
    hora: string
  ) => {
    return reservas.filter(
      (reserva) => reserva.peluqueroId === peluqueroId && reserva.hora === hora
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={60} color="#FC8181" />
      <Text style={styles.emptyStateText}>
        No hay citas programadas para el{" "}
        {fechaSeleccionada.format("dddd, D [de] MMMM")}
      </Text>
    </View>
  );

  const getOutOfHoursReservations = (date: dayjs.Dayjs) => {
    if (!workingHours) return [];

    const dayIndex = date.day().toString();
    const scheduleForDay = workingHours[dayIndex];

    if (!scheduleForDay) {
      return reservas.filter(
        (r) =>
          dayjs(`${r.fecha}T${r.hora}`).isAfter(date.endOf("day")) ||
          dayjs(`${r.fecha}T${r.hora}`).isBefore(date.startOf("day"))
      );
    }

    const startOfDay = date.startOf("day");
    const endOfDay = date.endOf("day");

    const reservationsToday = reservas.filter((r) =>
      dayjs(r.fecha).isSame(date, "day")
    );

    return reservationsToday
      .filter((reserva) => {
        const reservaTime = dayjs(`${reserva.fecha}T${reserva.hora}`);
        const isInWorkingHours = scheduleForDay.some((slot) => {
          const slotStart = dayjs(`${reserva.fecha}T${slot.start}`);
          const slotEnd = dayjs(`${reserva.fecha}T${slot.end}`);
          return reservaTime.isBetween(slotStart, slotEnd, null, "[)");
        });
        return !isInWorkingHours;
      })
      .sort((a, b) =>
        dayjs(`${a.fecha}T${a.hora}`).diff(dayjs(`${b.fecha}T${b.hora}`))
      );
  };

  useEffect(() => {
    setOutOfHoursReservations(getOutOfHoursReservations(fechaSeleccionada));
  }, [reservas, fechaSeleccionada, workingHours]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            setFechaSeleccionada(fechaSeleccionada.subtract(1, "day"))
          }
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={24} color="#CBD5E0" />
        </Pressable>
        <Pressable
          onPress={() => setShowMainDatePicker(true)}
          style={styles.dateDisplayButton}
        >
          <Ionicons name="calendar-outline" style={styles.calendarIcon} />
          <Text style={styles.fechaTexto}>
            {fechaSeleccionada.format("dddd, D [de] MMMM")}
          </Text>
        </Pressable>
        {showMainDatePicker && (
          <DateTimePicker
            value={fechaSeleccionada.toDate()}
            mode="date"
            display="calendar"
            onChange={onChangeFecha}
          />
        )}
        <Pressable
          onPress={() => setFechaSeleccionada(fechaSeleccionada.add(1, "day"))}
          style={styles.navButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#CBD5E0" />
        </Pressable>
      </View>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        <>
          {loadingPeluqueros || loadingReservas ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A5568" />
              <Text style={styles.loadingText}>Cargando agenda...</Text>
            </View>
          ) : peluqueros.length > 0 ? (
            <ScrollView>
              <ScrollView
                horizontal={true}
                contentContainerStyle={styles.agendaScrollViewContent}
              >
                <View style={styles.agendaInnerScrollView}>
                  <View style={[styles.columna, styles.timeColumn]}>
                    <View
                      style={[styles.firstColumnHeader, styles.celdaHeader]}
                    />
                    {generatedHours.map((hora) => (
                      <View key={hora} style={styles.firstColumnCell}>
                        <Text style={styles.celdaText}>{hora}</Text>
                      </View>
                    ))}
                  </View>
                  {peluqueros.map((peluquero, index) => {
                    const occupiedSlots = new Set<string>();
                    reservas
                      .filter((r) => r.peluqueroId === peluquero.id)
                      .forEach((reserva) => {
                        const service = servicios.find(
                          (s) => s.id === reserva.servicioId
                        );
                        if (service) {
                          const durationInMinutes = getDurationInMinutes(
                            service.duracion
                          );
                          const numSlots = Math.ceil(durationInMinutes / 30);
                          let current = dayjs(
                            `${reserva.fecha}T${reserva.hora}`
                          );
                          for (let i = 0; i < numSlots; i++) {
                            occupiedSlots.add(current.format("HH:mm"));
                            current = current.add(30, "minutes");
                          }
                        }
                      });
                    return (
                      <View
                        key={peluquero.id}
                        style={[
                          styles.columna,
                          styles.barberColumn,
                          index === 0 && styles.firstBarberColumn,
                          index === peluqueros.length - 1 && styles.lastColumn,
                        ]}
                      >
                        <View
                          style={[
                            styles.barberColumnHeader,
                            styles.celdaHeader,
                          ]}
                        >
                          <Text style={styles.celdaHeaderText}>
                            {peluquero.nombre}
                          </Text>
                        </View>
                        {generatedHours.map((hora) => {
                          const reservaEnHora = getReservasForPeluqueroAndTime(
                            peluquero.id,
                            hora
                          );

                          const isOccupiedAndNotStart =
                            reservaEnHora.length === 0 &&
                            occupiedSlots.has(hora);

                          if (isOccupiedAndNotStart) {
                            return null;
                          }

                          return (
                            <Pressable
                              key={hora}
                              onPress={() =>
                                handleCrearCitaRapida(peluquero.id, hora)
                              }
                              style={[
                                styles.celda,
                                reservaEnHora.length > 0 &&
                                  styles.celdaReservadaOcupada,
                              ]}
                            >
                              {reservaEnHora.length > 0 && (
                                <View style={styles.reservaContent}>
                                  {reservaEnHora.map((reserva) =>
                                    renderReserva(reserva)
                                  )}
                                </View>
                              )}
                            </Pressable>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </ScrollView>
          ) : (
            renderEmptyState()
          )}
        </>
      )}

      <View style={styles.outOfHoursContainer}>
        <View style={styles.outOfHoursHeader}>
          <Text style={styles.outOfHoursTitle}>Citas fuera de horario</Text>
          <Pressable
            onPress={() => {
              setModalCrearVisible(true);
              setCrearFecha(fechaSeleccionada.toDate());
              setCrearPeluqueroId(
                peluqueros.length > 0 ? peluqueros[0].id : ""
              );
              setCrearServicioId(servicios.length > 0 ? servicios[0].id : "");
              setCrearClienteNombre("");
              setCrearClienteTelefono("");
              setCrearHora("9:00");
              setShowOutOfHoursTimePicker(true);
            }}
            style={styles.addOutOfHoursButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addOutOfHoursButtonText}>
              Cita Fuera de Hora
            </Text>
          </Pressable>
        </View>
        <ScrollView>
          {outOfHoursReservations.length > 0 ? (
            outOfHoursReservations.map((reserva) => {
              const peluquero = peluqueros.find(
                (p) => p.id === reserva.peluqueroId
              );
              return (
                <Pressable
                  key={reserva.id}
                  onPress={() => {
                    setReservaSeleccionada(reserva);
                    setModalVisible(true);
                  }}
                  style={styles.outOfHoursCard}
                >
                  <View style={styles.outOfHoursDetails}>
                    <Text style={styles.outOfHoursTime}>{reserva.hora}</Text>
                    <Text style={styles.outOfHoursText}>
                      {reserva.clienteNombre}
                    </Text>
                  </View>
                  {peluquero && (
                    <Text style={styles.outOfHoursPeluquero}>
                      Peluquero: {peluquero.nombre}
                    </Text>
                  )}
                </Pressable>
              );
            })
          ) : (
            <></>
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCrearVisible}
        onRequestClose={() => setModalCrearVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[styles.compactModalContainer, { position: "relative" }]}
          >
            <Text style={styles.compactModalTitle}>Crear Cita</Text>

            <Text style={styles.compactLabel}>Servicio</Text>
            <View style={styles.compactOptionButtonsContainer}>
              {servicios.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => setCrearServicioId(s.id)}
                  style={[
                    styles.compactSelectionButton,
                    crearServicioId === s.id &&
                      styles.compactSelectionButtonSelected,
                  ]}
                >
                  <Text
                    style={
                      crearServicioId === s.id
                        ? styles.compactSelectionButtonTextSelected
                        : styles.compactSelectionButtonText
                    }
                  >
                    {String(s.nombre)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.compactLabel}>Cliente</Text>
            <TextInput
              value={crearClienteNombre}
              onChangeText={handleClienteNombreChange}
              placeholder="Nombre del cliente"
              style={styles.compactInput}
            />
            {showUserSuggestions && filteredUsers.length > 0 && (
              <ScrollView style={styles.userSuggestionsContainer}>
                {filteredUsers.map((user) => (
                  <Pressable
                    key={user.id}
                    onPress={() => selectSuggestedUser(user)}
                    style={styles.userSuggestionItem}
                  >
                    <Text style={styles.userSuggestionText}>
                      {user.nombre} {user.telefono ? `(${user.telefono})` : ""}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            <Text style={styles.compactLabel}>Teléfono (Opcional)</Text>
            <TextInput
              value={crearClienteTelefono}
              onChangeText={setCrearClienteTelefono}
              placeholder="Ej: 612345678"
              style={styles.compactInput}
              keyboardType="phone-pad"
            />

            {showOutOfHoursTimePicker && (
              <>
                <Text style={styles.compactLabel}>Peluquero</Text>
                <View style={styles.compactOptionButtonsContainer}>
                  {peluqueros.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => setCrearPeluqueroId(p.id)}
                      style={[
                        styles.compactSelectionButton,
                        crearPeluqueroId === p.id &&
                          styles.compactSelectionButtonSelected,
                      ]}
                    >
                      <Text
                        style={
                          crearPeluqueroId === p.id
                            ? styles.compactSelectionButtonTextSelected
                            : styles.compactSelectionButtonText
                        }
                      >
                        {String(p.nombre)}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.compactLabel}>Hora de la cita</Text>
                <Pressable
                  onPress={() => setShowCrearHoraPicker(true)}
                  style={styles.compactDateInput}
                >
                  <Text style={styles.compactSelectionButtonText}>
                    {crearHora}
                  </Text>
                  <Ionicons name="time-outline" size={20} color="#E2E8F0" />
                </Pressable>
                {showCrearHoraPicker && (
                  <DateTimePicker
                    value={dayjs(
                      `${fechaSeleccionada.format("YYYY-MM-DD")}T${crearHora}`
                    ).toDate()}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) {
                        setCrearHora(dayjs(selectedTime).format("HH:mm"));
                      }
                      setShowCrearHoraPicker(false);
                    }}
                  />
                )}
              </>
            )}

            <Pressable
              style={styles.compactSaveButton}
              onPress={guardarCitaRapida}
            >
              <Text style={styles.compactSaveButtonText}>Crear Cita</Text>
            </Pressable>
            <Pressable
              style={styles.compactCancelButton}
              onPress={() => setModalCrearVisible(false)}
            >
              <Text style={styles.compactCancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {reservaSeleccionada && (
        <EditReservaModal
          reserva={reservaSeleccionada}
          servicios={servicios}
          peluqueros={peluqueros}
          usersData={usersData}
          onClose={() => {
            setModalVisible(false);
            setReservaSeleccionada(null);
          }}
          onSave={guardarCambiosReserva}
  onPrintTicket={handlePrintTicket}   // 👈 aquí se lo pasas
          generatedHours={generatedHours}
          onBonoUpdated={() => {}}
        />
      )}
      {ticketModalVisible && reservaSeleccionada && (
        <TicketModal
          reserva={reservaSeleccionada}
          peluqueroNombre={peluqueros.find((p) => p.id === reservaSeleccionada.peluqueroId)
            ?.nombre || "Desconocido"}
          servicioNombre={servicios.find((s) => s.id === reservaSeleccionada.servicioId)
            ?.nombre || "Desconocido"}
          servicioPrecio={servicios.find((s) => s.id === reservaSeleccionada.servicioId)
            ?.precio || 0}
          onClose={() => setTicketModalVisible(false)} visible={ticketModalVisible}        />
      )}
    </SafeAreaView>
  );
}
