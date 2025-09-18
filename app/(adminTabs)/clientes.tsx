import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../lib/firebaseConfig";
import { modalStyles } from "../../styles/clientes.modal.styles";
import { styles } from "../../styles/clientes.styles";

type Bono = {
  id: string;
  tipo: "dos_cortes_mes" | "cuatro_cortes_mes";
  totalCortes: number;
  cortesUsados: number;
  fechaInicio: string;
  fechaExpiracion: string;
};

type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  reputacion: "buena" | "regular" | "mala";
  rol: string;
  reservas?: string[];
  bonoActivo?: Bono | null;
  bonoActivoId?: string | null;
};

type ReservaDetalle = {
  id: string;
  fecha: string;
  hora: string;
  peluqueroNombre: string;
  servicioNombre: string;
  estado: "pendiente" | "completada" | "cancelada";
};

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
};

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientReservations, setClientReservations] = useState<ReservaDetalle[]>(
    []
  );
  const [loadingClientReservations, setLoadingClientReservations] =
    useState(false);

  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showBonoOptions, setShowBonoOptions] = useState(false);

  const [assigningBono, setAssigningBono] = useState(false);
  const [cancelingBono, setCancelingBono] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "Usuarios"),
          where("rol", "==", "cliente")
        );
        const querySnapshot = await getDocs(q);
        const list: Cliente[] = [];
        querySnapshot.forEach((d) => {
          const data = d.data() as Omit<Cliente, "id">;
          list.push({ id: d.id, ...data });
        });
        setClientes(list);
        setFilteredClientes(list);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        Alert.alert("Error", "No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [reputacionFiltro, setReputacionFiltro] = useState<'all' | 'buena' | 'regular' | 'mala'>('all');
  
  useEffect(() => {
    let filtered = clientes;
    if (filtro.trim() !== "") {
      const f = filtro.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(f) ||
          c.email?.toLowerCase().includes(f) ||
          c.telefono?.includes(filtro)
      );
    }
    if (reputacionFiltro !== 'all') {
      filtered = filtered.filter((c) => c.reputacion === reputacionFiltro);
    }
    setFilteredClientes(filtered);
  }, [filtro, clientes, reputacionFiltro]);

  const fetchClientReservations = useCallback(async (clientId: string) => {
    setLoadingClientReservations(true);
    setClientReservations([]);
    try {
      const clientRef = doc(db, "Usuarios", clientId);
      const snap = await getDoc(clientRef);
      if (!snap.exists()) {
        throw new Error("Cliente no encontrado");
      }
      const userData = snap.data() as Cliente;
      let bonoActivo: Bono | null = null;
      const bonoId = (userData as any).bonoActivoId as string | undefined;
      if (bonoId) {
        const bonoRef = doc(db, "Bonos", bonoId);
        const bonoSnap = await getDoc(bonoRef);
        if (bonoSnap.exists()) {
          const b = bonoSnap.data() as Omit<Bono, "id">;
          if (b.cortesUsados < b.totalCortes) {
            bonoActivo = { id: bonoSnap.id, ...b };
          }
        }
      } else {
        const bq = query(
          collection(db, "Bonos"),
          where("userId", "==", clientId),
          where("cortesUsados", "<", 4)
        );
        const bsnap = await getDocs(bq);
        if (!bsnap.empty) {
          const bdoc = bsnap.docs[0];
          const b = bdoc.data() as Omit<Bono, "id">;
          if (b.cortesUsados < b.totalCortes) {
            bonoActivo = { id: bdoc.id, ...b };
          }
        }
      }
      setSelectedClient({
        id: snap.id,
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        reputacion: userData.reputacion,
        rol: userData.rol,
        reservas: userData.reservas || [],
        bonoActivoId: bonoId || null,
        bonoActivo,
      });

      const reservaIds = (userData.reservas || []).filter(Boolean);
      if (reservaIds.length === 0) {
        setClientReservations([]);
        return;
      }
      const fetched: ReservaDetalle[] = [];
      const [peluquerosSnap, serviciosSnap] = await Promise.all([
        getDocs(collection(db, "Peluqueros")),
        getDocs(collection(db, "Servicios")),
      ]);
      const peluquerosMap = new Map<string, string>();
      peluquerosSnap.forEach((d) =>
        peluquerosMap.set(d.id, (d.data() as any).nombre)
      );
      const serviciosMap = new Map<string, string>();
      serviciosSnap.forEach((d) =>
        serviciosMap.set(d.id, (d.data() as any).nombre)
      );
      const chunks = chunkArray(reservaIds, 10);
      const snapPromises = chunks.map((chunk) =>
        getDocs(
          query(collection(db, "Reservas"), where(documentId(), "in", chunk))
        )
      );
      const results = await Promise.all(snapPromises);
      results.forEach((rs) => {
        rs.forEach((d) => {
          const r = d.data() as any;
          fetched.push({
            id: d.id,
            fecha: r.fecha,
            hora: r.hora,
            peluqueroNombre: peluquerosMap.get(r.peluqueroId) || "Desconocido",
            servicioNombre: serviciosMap.get(r.servicioId) || "Desconocido",
            estado: (r.estado || "pendiente") as
              | "pendiente"
              | "completada"
              | "cancelada",
          });
        });
      });
      fetched.sort((a, b) => {
        const aT = dayjs(`${a.fecha}T${a.hora}`).valueOf();
        const bT = dayjs(`${b.fecha}T${b.hora}`).valueOf();
        return aT - bT;
      });
      setClientReservations(fetched);
    } catch (error) {
      console.error("Error cargando reservas del cliente:", error);
      Alert.alert("Error", "No se pudieron cargar las reservas del cliente.");
    } finally {
      setLoadingClientReservations(false);
    }
  }, []);

  const handleClientPress = async (client: Cliente) => {
    await fetchClientReservations(client.id);
    setShowReservationsModal(true);
  };

  const handleAssignBono = async (
    bonoType: "dos_cortes_mes" | "cuatro_cortes_mes"
  ) => {
    if (!selectedClient || assigningBono) return;
    if (selectedClient.bonoActivo) {
      Alert.alert("Aviso", "Este cliente ya tiene un bono activo.");
      return;
    }
    setAssigningBono(true);
    const totalCortes = bonoType === "dos_cortes_mes" ? 2 : 4;
    const fechaInicio = dayjs().format("YYYY-MM-DD");
    const fechaExpiracion = dayjs().add(1, "month").format("YYYY-MM-DD");
    try {
      const bonoRef = await addDoc(collection(db, "Bonos"), {
        userId: selectedClient.id,
        tipo: bonoType,
        totalCortes,
        cortesUsados: 0,
        fechaInicio,
        fechaExpiracion,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(doc(db, "Usuarios", selectedClient.id), {
        bonoActivoId: bonoRef.id,
      });
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              bonoActivoId: bonoRef.id,
              bonoActivo: {
                id: bonoRef.id,
                tipo: bonoType,
                totalCortes,
                cortesUsados: 0,
                fechaInicio,
                fechaExpiracion,
              },
            }
          : prev
      );
      setShowBonoOptions(false);
    } catch (e) {
      console.error("Error al asignar el bono:", e);
    } finally {
      setAssigningBono(false);
    }
  };

  const handleCancelBono = async () => {
    if (!selectedClient?.bonoActivo || cancelingBono) return;
    setCancelingBono(true);
    try {
      await deleteDoc(doc(db, "Bonos", selectedClient.bonoActivo.id));
      await updateDoc(doc(db, "Usuarios", selectedClient.id), {
        bonoActivoId: null,
      });
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              bonoActivo: null,
              bonoActivoId: null,
            }
          : prev
      );
    } catch (e) {
      console.error("Error al cancelar el bono:", e);
    } finally {
      setCancelingBono(false);
    }
  };

  const getReputacionStyle = (reputacion: string) => {
    const lower = (reputacion || "").toLowerCase();
    if (lower === "buena") return styles.reputacionBuena;
    if (lower === "regular") return styles.reputacionRegular;
    if (lower === "mala") return styles.reputacionMala;
    return {};
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, { flex: 2 }]}>Nombre</Text>
      <Text style={[styles.headerText, { flex: 3 }]}>Email</Text>
      <Text style={[styles.headerText, { flex: 2 }]}>Teléfono</Text>
      <Text style={[styles.headerText, { flex: 1.5, textAlign: "center" }]}>
        Reputación
      </Text>
    </View>
  );

  const ClienteRow = ({ item }: { item: Cliente }) => (
    <Pressable style={styles.clienteRow} onPress={() => handleClientPress(item)}>
      <Text style={[styles.rowText, { flex: 2 }]}>{item.nombre}</Text>
      <Text style={[styles.rowText, { flex: 3 }]}>{item.email}</Text>
      <Text style={[styles.rowText, { flex: 2 }]}>{item.telefono}</Text>
      <Text
        style={[
          styles.rowText,
          getReputacionStyle(item.reputacion),
          { flex: 1.5, textAlign: "center" },
        ]}
      >
        {item.reputacion}
      </Text>
    </Pressable>
  );

  const getEstadoStyle = (estado: "pendiente" | "completada" | "cancelada") => {
    if (estado === "completada") return modalStyles.estadoCompletada;
    if (estado === "cancelada") return modalStyles.estadoCancelada;
    return modalStyles.estadoPendiente;
  };

  const ClientReservationsModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={showReservationsModal}
      onRequestClose={() => setShowReservationsModal(false)}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>
            Reservas de {selectedClient?.nombre}
          </Text>

          <View style={modalStyles.bonoContainer}>
            {selectedClient?.bonoActivo ? (
              <View style={modalStyles.bonoInfo}>
                <Text style={modalStyles.bonoText}>
                  Bono Activo:{" "}
                  <Text style={modalStyles.bonoTipo}>
                    {selectedClient.bonoActivo.tipo === "dos_cortes_mes"
                      ? "2 Cortes"
                      : "4 Cortes"}
                  </Text>
                </Text>
                <Text style={modalStyles.bonoText}>
                  Cortes Restantes:{" "}
                  <Text style={modalStyles.bonoRestantes}>
                    {selectedClient.bonoActivo.totalCortes -
                      selectedClient.bonoActivo.cortesUsados}
                  </Text>
                </Text>

                <Pressable
                  style={[
                    modalStyles.bonoButton,
                    cancelingBono && { opacity: 0.6 },
                  ]}
                  onPress={handleCancelBono}
                  disabled={cancelingBono}
                >
                  <Text style={modalStyles.bonoButtonText}>
                    {cancelingBono ? "Anulando..." : "Anular Bono"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={modalStyles.noBonoText}>
                  Este cliente no tiene un bono activo.
                </Text>
                <Pressable
                  style={modalStyles.bonoButton}
                  onPress={() => setShowBonoOptions((s) => !s)}
                >
                  <Text style={modalStyles.bonoButtonText}>Asignar Bono</Text>
                </Pressable>
              </View>
            )}
            {showBonoOptions && !selectedClient?.bonoActivo && (
              <View style={modalStyles.bonoOptions}>
                <Pressable
                  style={[
                    modalStyles.bonoOptionButton,
                    assigningBono && { opacity: 0.6 },
                  ]}
                  onPress={() => handleAssignBono("dos_cortes_mes")}
                  disabled={assigningBono}
                >
                  <Text style={modalStyles.bonoOptionText}>
                    {assigningBono ? "Asignando..." : "Bono 2 Cortes"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    modalStyles.bonoOptionButton,
                    assigningBono && { opacity: 0.6 },
                  ]}
                  onPress={() => handleAssignBono("cuatro_cortes_mes")}
                  disabled={assigningBono}
                >
                  <Text style={modalStyles.bonoOptionText}>
                    {assigningBono ? "Asignando..." : "Bono 4 Cortes"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
          <View style={modalStyles.reservasSection}>
            <Text style={modalStyles.reservasHeader}>Historial de Reservas</Text>
            {loadingClientReservations ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 20 }} />
            ) : clientReservations.length > 0 ? (
              <FlatList
                data={clientReservations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={modalStyles.reservaItem}>
                    <Text style={modalStyles.reservaText}>
                      <Text style={modalStyles.reservaLabel}>Fecha:</Text>{" "}
                      {dayjs(item.fecha).format("DD/MM/YYYY")}
                    </Text>
                    <Text style={modalStyles.reservaText}>
                      <Text style={modalStyles.reservaLabel}>Hora:</Text> {item.hora}
                    </Text>
                    <Text style={modalStyles.reservaText}>
                      <Text style={modalStyles.reservaLabel}>Peluquero:</Text>{" "}
                      {item.peluqueroNombre}
                    </Text>
                    <Text style={modalStyles.reservaText}>
                      <Text style={modalStyles.reservaLabel}>Servicio:</Text>{" "}
                      {item.servicioNombre}
                    </Text>
                    <Text
                      style={[
                        modalStyles.reservaText,
                        modalStyles.reservaEstado,
                        getEstadoStyle(item.estado),
                      ]}
                    >
                      <Text style={modalStyles.reservaLabel}>Estado:</Text>{" "}
                      {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                    </Text>
                  </View>
                )}
                style={modalStyles.reservasList}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <Text style={modalStyles.noReservasText}>
                Este cliente no tiene reservas registradas.
              </Text>
            )}
          </View>
          <Pressable
            style={[modalStyles.button, modalStyles.buttonClose]}
            onPress={() => {
              setShowReservationsModal(false);
              setShowBonoOptions(false);
            }}
          >
            <Text style={modalStyles.textStyle}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* Contenedor principal para las dos columnas */}
        <View style={styles.twoColumnLayout}>
          {/* Columna Izquierda: Buscador y Filtros */}
          <View style={styles.leftColumn}>
            <Text style={styles.headerTitle}>Gestión de Clientes</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar cliente por nombre, email o teléfono..."
                placeholderTextColor="#888"
                style={styles.searchInput}
                value={filtro}
                onChangeText={setFiltro}
              />
              {filtro.length > 0 && (
                <Pressable onPress={() => setFiltro("")}>
                  <Ionicons
                    size={20}
                    name="close-circle"
                    color="#888"
                    style={styles.clearSearchIcon}
                  />
                </Pressable>
              )}
            </View>
            <Text style={styles.filterSectionTitle}>Filtrar por reputación</Text>
            <View style={styles.reputacionOptionsContainer}>
              <Pressable
                onPress={() => setReputacionFiltro('all')}
                style={[styles.reputacionButton, reputacionFiltro === 'all' && styles.activeReputacionButton]}
              >
                <Text style={[styles.reputacionButtonText, reputacionFiltro === 'all' && styles.activeReputacionText]}>Todos</Text>
              </Pressable>
              <Pressable
                onPress={() => setReputacionFiltro('buena')}
                style={[styles.reputacionButton, reputacionFiltro === 'buena' && styles.activeReputacionButton]}
              >
                <Text style={[styles.reputacionButtonText, reputacionFiltro === 'buena' && styles.activeReputacionText]}>Buena</Text>
              </Pressable>
              <Pressable
                onPress={() => setReputacionFiltro('regular')}
                style={[styles.reputacionButton, reputacionFiltro === 'regular' && styles.activeReputacionButton]}
              >
                <Text style={[styles.reputacionButtonText, reputacionFiltro === 'regular' && styles.activeReputacionText]}>Regular</Text>
              </Pressable>
              <Pressable
                onPress={() => setReputacionFiltro('mala')}
                style={[styles.reputacionButton, reputacionFiltro === 'mala' && styles.activeReputacionButton]}
              >
                <Text style={[styles.reputacionButtonText, reputacionFiltro === 'mala' && styles.activeReputacionText]}>Mala</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.rightColumn}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando clientes...</Text>
              </View>
            ) : (
              <>
                <TableHeader />
                <FlatList
                  data={filteredClientes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <ClienteRow item={item} />}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <Ionicons name="person-remove" size={50} color="#ccc" />
                      <Text style={styles.emptyListText}>
                        No hay clientes que coincidan con la búsqueda.
                      </Text>
                      {filtro.length > 0 && (
                        <Button title="Limpiar búsqueda" onPress={() => setFiltro("")} />
                      )}
                    </View>
                  }
                  contentContainerStyle={filteredClientes.length === 0 ? styles.emptyListContainer : undefined}
                />
              </>
            )}
          </View>
        </View>
      </View>
      {selectedClient && <ClientReservationsModal />}
    </SafeAreaView>
  );
}