import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/index.admin.styles";

function PaymentModal({
  visible,
  onSelect,
  onClose,
  hasActiveBono,
  importe,
  dineroRecibido,
  cambio,
}: {
  visible: boolean;
  onSelect: (method: "tarjeta" | "efectivo" | "bono") => void;
  onClose: () => void;
  hasActiveBono: boolean;
  importe: string;
  dineroRecibido: string;
  cambio: number;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.compactModalContainer}>
          <Text style={styles.compactModalTitle}>Resumen de Pago</Text>

          <Text>Importe: {importe} €</Text>
          <Text>Recibido: {dineroRecibido} €</Text>
          <Text>Cambio: {cambio >= 0 ? cambio.toFixed(2) : "0.00"} €</Text>

          <Text style={[styles.compactModalTitle, { marginTop: 15 }]}>
            Seleccionar Método de Pago
          </Text>

          <View style={styles.paymentOptionsContainer}>
            <Pressable
              style={styles.paymentOptionButton}
              onPress={() => onSelect("tarjeta")}
            >
              <Text style={styles.paymentOptionText}>Tarjeta</Text>
            </Pressable>

            <Pressable
              style={styles.paymentOptionButton}
              onPress={() => onSelect("efectivo")}
            >
              <Text style={styles.paymentOptionText}>Efectivo</Text>
            </Pressable>

            {hasActiveBono && (
              <Pressable
                style={styles.paymentOptionButton}
                onPress={() => onSelect("bono")}
              >
                <Text style={styles.paymentOptionText}>Bono</Text>
              </Pressable>
            )}
          </View>

          <Pressable style={styles.compactCancelButton} onPress={onClose}>
            <Text style={styles.compactCancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default PaymentModal;
