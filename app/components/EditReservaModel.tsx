import dayjs from "dayjs";
import { doc, increment, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../../lib/firebaseConfig";
import { styles as externalStyles } from "../../styles/index.admin.styles";
import { Peluquero, Reserva, Servicio, UserData } from "../utils/helpers";
import PaymentModal from "./PaymentModal";

// --- TIPOS DE DATOS ---
type Bono = {
  id: string;
  tipo: string;
  totalCortes: number;
  cortesUsados: number;
  fechaInicio: string;
  fechaExpiracion: string;
};

// Se importa el tipo de dato Reserva desde helpers.ts en lugar de redefinirlo aquí
// type Reserva = {
//   id: string;
//   clienteNombre: string;
//   fecha: string;
//   servicioId: string;
//   estado: "pendiente" | "completada" | "cancelada" | "no asistido";
//   metodoPago?: "tarjeta" | "efectivo" | "bono";
// };

function EditReservaModal({
  reserva,
  servicios,
  peluqueros,
  usersData,
  onClose,
  onSave,
  onPrintTicket,
  onBonoUpdated,
}: {
  reserva: Reserva;
  servicios: Servicio[];
  peluqueros: Peluquero[];
  usersData: { [key: string]: UserData };
  onClose: () => void;
  onSave: (reservaActualizada: Partial<Reserva>) => void;
  onPrintTicket: (reserva: Reserva) => void;
  onBonoUpdated: () => void;
  generatedHours?: string[]; // Propiedad opcional
}) {
  const servicio = servicios.find((s) => s.id === reserva.servicioId);

  const [importe, setImporte] = useState(
    servicio ? servicio.precio.toFixed(2) : "0.00"
  );
  const [dineroRecibido, setDineroRecibido] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bonoDelUsuario, setBonoDelUsuario] = useState<Bono | null>(null);

  const cambio =
    (parseFloat(dineroRecibido) || 0) - (parseFloat(importe) || 0);

  const hasActiveBono = !!(
    bonoDelUsuario && bonoDelUsuario.cortesUsados < bonoDelUsuario.totalCortes
  );

  // 👉 Guardar con método de pago
  const handleSaveWithPayment = async (
    metodoPago: "tarjeta" | "efectivo" | "bono"
  ) => {
    if (metodoPago === "bono" && bonoDelUsuario) {
      try {
        const bonoRef = doc(db, "Bonos", bonoDelUsuario.id);
        await updateDoc(bonoRef, {
          cortesUsados: increment(1),
        });
        if (onBonoUpdated) onBonoUpdated();
      } catch (error) {
        console.error("Error al actualizar el bono:", error);
        Alert.alert("Error", "No se pudo actualizar el uso del bono.");
      }
    }

    const cambios: Partial<Reserva> = {
      estado: "completada",
      metodoPago,
    };
    onSave(cambios);
    setShowPaymentModal(false);
  };

  if (!reserva) return null;

  return (
    <Modal
      visible={true}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.modalBackground}>
        <View style={styles.compactModalContainer}>
          <Text style={styles.compactModalTitle}>Caja</Text>

          <Text style={styles.compactLabel}>
            Cliente: {String(reserva.clienteNombre)}
          </Text>
          <Text style={styles.compactLabel}>
            Fecha: {String(dayjs(reserva.fecha).format("DD/MM/YYYY"))}
          </Text>
          <Text style={styles.compactLabel}>
            Servicio: {servicio ? servicio.nombre : "Sin servicio"}
          </Text>

          {/* IMPORTE */}
          <Text style={styles.compactLabel}>Importe (€)</Text>
          <TextInput
            style={styles.compactInput}
            keyboardType="numeric"
            value={importe}
            onChangeText={setImporte}
          />

          {/* DINERO RECIBIDO */}
          <Text style={styles.compactLabel}>Dinero recibido (€)</Text>
          <TextInput
            style={styles.compactInput}
            keyboardType="numeric"
            value={dineroRecibido}
            onChangeText={setDineroRecibido}
          />

          {/* CAMBIO */}
          <Text style={styles.compactLabel}>
            Cambio: {cambio >= 0 ? cambio.toFixed(2) : "0.00"} €
          </Text>

          {/* BOTÓN FINALIZAR */}
          <Pressable
            style={styles.compactSaveButton}
            onPress={() => {
              if (!importe || !dineroRecibido) {
                Alert.alert("Error", "Debe ingresar importe y dinero recibido.");
                return;
              }
              setShowPaymentModal(true);
            }}
          >
            <Text style={styles.compactSaveButtonText}>Finalizar Pago</Text>
          </Pressable>

          {/* BOTÓN IMPRIMIR */}
          <Pressable
            style={[styles.compactSaveButton, styles.printTicketButton]}
            onPress={() => onPrintTicket(reserva)}
          >
            <Text style={styles.compactSaveButtonText}>Imprimir Ticket</Text>
          </Pressable>

          {/* BOTÓN CANCELAR */}
          <Pressable style={styles.compactCancelButton} onPress={onClose}>
            <Text style={styles.compactCancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>

      {/* MODAL DE PAGO */}
      {showPaymentModal && (
        <PaymentModal
          visible={showPaymentModal}
          onSelect={handleSaveWithPayment}
          onClose={() => setShowPaymentModal(false)}
          hasActiveBono={hasActiveBono}
          importe={importe}
          dineroRecibido={dineroRecibido}
          cambio={cambio}
        />
      )}
    </Modal>
  );
}

// 👉 Estilos
const styles = StyleSheet.create({
  ...externalStyles,
  printTicketButton: {
    backgroundColor: "#007AFF",
    marginTop: 10,
  },
});

export default EditReservaModal;