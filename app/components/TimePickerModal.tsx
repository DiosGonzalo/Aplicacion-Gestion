import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/index.admin.styles";

function TimePickerModal({
  visible,
  onClose,
  onSelectTime,
  availableTimes,
  selectedTime,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (time: string) => void;
  availableTimes: string[];
  selectedTime: string;
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
          <Text style={styles.compactModalTitle}>Seleccionar Hora</Text>
          <ScrollView style={styles.timePickerScrollView}>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => onSelectTime(time)}
                  style={[
                    styles.timePickerOption,
                    selectedTime === time && styles.timePickerOptionSelected,
                  ]}
                >
                  <Text
                    style={
                      selectedTime === time
                        ? styles.timePickerOptionTextSelected
                        : styles.timePickerOptionText
                    }
                  >
                    {time}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noHoursText}>
                No hay horas disponibles para este día.
              </Text>
            )}
          </ScrollView>
          <Pressable style={styles.compactCancelButton} onPress={onClose}>
            <Text style={styles.compactCancelButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default TimePickerModal;