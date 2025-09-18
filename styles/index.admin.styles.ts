import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  safeArea: {
    flex: 1,
    backgroundColor: "#1A202C", // Gris oscuro profundo, casi negro
  }, // Estilos para el estado de carga

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A202C",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#CBD5E0", // Texto gris claro para contraste
    fontWeight: "700",
    letterSpacing: 0.8,
  }, // Estilos para el estado vacío (sin datos)

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25, // Reducir un poco el padding
    backgroundColor: "#2D3748", // Gris oscuro medio
    margin: 15, // Reducir margen para más espacio
    borderRadius: 12, // Menos redondeado para un look más compacto
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Sombra más contenida
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  emptyStateText: {
    fontSize: 19, // Ligeramente más pequeño
    color: "#FC8181", // Rojo suave pero visible para advertencia
    textAlign: "center",
    marginTop: 15, // Ajustar margen
    fontWeight: "800",
    lineHeight: 26,
  }, // Estilos para la caja de error

  errorBox: {
    backgroundColor: "#3C1F2E", // Rojo oscuro muy sutil, casi negro rojizo
    borderColor: "#E53E3E", // Rojo más vibrante para el borde
    borderWidth: 1,
    marginHorizontal: 15, // Reducir margen
    marginVertical: 12,
    padding: 12, // Reducir padding
    borderRadius: 8, // Menos redondeado
    alignItems: "center",
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  errorText: {
    color: "#FBD38D", // Amarillo suave para el texto de error para contraste
    fontSize: 15, // Ligeramente más pequeño
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  }, // Estilos del encabezado

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12, // Reducir padding vertical
    paddingHorizontal: 15, // Reducir padding horizontal
    backgroundColor: "#2D3748", // Gris oscuro medio
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  }, // Contenedor de navegación de fechas

  dateNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A5568", // Gris azulado más oscuro
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  navButtonPressed: {
    opacity: 0.6,
  },
  dateDisplayButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8, // Reducir margen
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#2D3748", // Fondo más oscuro para el botón de fecha
  },
  calendarIcon: {
    marginRight: 8,
    fontSize: 18,
    color: "#9F7AEA", // Morado vibrante
  },
  fechaTexto: {
    fontWeight: "700", // Ligeramente menos negrita
    fontSize: 15, // Más pequeño
    color: "#E2E8F0", // Texto claro
    textTransform: "capitalize",
  }, // Botón para crear nueva cita

  createAppointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38A169", // Verde esmeralda vibrante
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#38A169",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  createAppointmentButtonPressed: {
    opacity: 0.7,
  },
  createAppointmentButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },
  createAppointmentIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  }, // Contenedores de la agenda

  agendaScrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  agendaInnerScrollView: {
    flexDirection: "row",
    flexGrow: 1,
  },
  columna: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2D3748", // Fondo gris oscuro para las columnas
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  timeColumn: {
    flex: 0.2,
    width: Dimensions.get("window").width * 0.2,
    backgroundColor: "#1A202C", // Gris oscuro muy profundo para la columna de tiempo
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  barberColumn: {
    flex: 1,
    width: Dimensions.get("window").width * 0.26,
  },
  firstColumnHeader: {
    backgroundColor: "#4A5568", // Gris azulado más oscuro para el encabezado
    borderBottomWidth: 1,
    borderColor: "#2D3748", // Borde más oscuro
    borderTopLeftRadius: 10,
  },
  barberColumnHeader: {
    backgroundColor: "#4A5568",
    borderBottomWidth: 1,
    borderColor: "#2D3748",
  },
  celdaHeader: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  celdaHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E2E8F0", // Texto claro
    textAlign: "center",
  },
  firstColumnCell: {
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#2D3748", // Borde oscuro
    paddingHorizontal: 6,
    height: 60,
  },
  celda: {
  minHeight: 60,
  borderBottomWidth: 0.5, // Reduced from 1 to make it softer
  borderBottomColor: '#ccc', // A light gray color instead of the default black
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 6,
  paddingVertical: 4,
},
  celdaText: {
    fontSize: 12,
    color: "#A0AEC0", // Gris medio para el texto
  },
  celdaReservada: {
    backgroundColor: "#2F5941", // Verde oscuro sutil
    borderColor: "#38A169",
    borderWidth: 1,
  },
  celdaCompletada: {
    backgroundColor: "#2C5282", // Azul oscuro sutil
    borderColor: "#3182CE",
    borderWidth: 1,
  },
  celdaCancelada: {
    backgroundColor: "#5A2A38", // Rojo oscuro sutil
    borderColor: "#E53E3E",
    borderWidth: 1,
    opacity: 0.9,
  },
  celdaReservadaOcupada: {
    backgroundColor: "#3e7253", // Un verde más claro para distinguir celdas ocupadas
    opacity: 0.7,
  },
  reservaContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: -4,
    marginBottom: -4,
  },
  singleReservationEntry: {
    width: "100%",
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginBottom: 0,
    backgroundColor: "#4A5568", // Gris azulado más oscuro para la reserva individual
    borderRadius: 4,
  },
  singleReservationEntryBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#2D3748", // Borde oscuro
    paddingBottom: 4,
    marginBottom: 4,
  },
  reservaTexto: {
    color: "#9AE6B4", // Verde claro para contraste
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  reservaTelefono: {
    color: "#9AE6B4",
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  loadingReservasCell: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#2D3748",
    backgroundColor: "#2D3748",
  },
  lastColumn: {
    borderRightWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  firstBarberColumn: {
    borderLeftWidth: 1,
    borderColor: "#2D3748",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  outOfHoursCell: {
    backgroundColor: "#5A4C2F", // Amarillo/marrón oscuro
    borderColor: "#ECC94B", // Dorado para el borde
    borderWidth: 1,
  }, // Estilos para el modal de edición/creación de reserva

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Fondo muy oscuro para el modal
  },
  compactModalContainer: {
    maxHeight: "110%", // Un poco más de altura para las nuevas opciones
    width: "90%",
    backgroundColor: "#2D3748", // Gris oscuro para el modal
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  compactModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#E2E8F0", // Texto claro
    textAlign: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#4A5568", // Borde más oscuro
    paddingBottom: 15,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A0AEC0", // Gris medio para el label
    marginBottom: 6,
    marginTop: 12,
    width: "100%",
    textAlign: "left",
  },
  compactInput: {
    borderWidth: 1,
    borderColor: "#4A5568", // Borde oscuro
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: "#E2E8F0", // Texto claro
    marginBottom: 12,
    width: "100%",
    backgroundColor: "#2D3748", // Fondo oscuro para inputs
  },
  compactDateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4A5568",
    borderRadius: 6,
    marginBottom: 12,
    width: "100%",
  }, // *** ESTILOS PARA LOS BOTONES DE SELECCIÓN DE OPCIONES (PELUQUERO/SERVICIO) *** // Contenedor para envolver los botones de opciones (flex-wrap)

  compactOptionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los botones se envuelvan a la siguiente línea
    justifyContent: "flex-start", // Alinea los botones a la izquierda (como en la imagen)
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 0, // No necesitas padding horizontal aquí si los márgenes de los botones lo manejan
  }, // Estilo individual para cada botón de opción (Peluquero/Servicio)
  compactSelectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // Forma de píldora
    borderWidth: 1,
    borderColor: "#4A5568", // Borde oscuro
    backgroundColor: "#2D3748", // Fondo oscuro para los botones
    marginRight: 8, // Espacio a la derecha de cada botón
    marginBottom: 8, // Espacio debajo de cada botón para wrap
  },
  compactSelectionButtonSelected: {
    backgroundColor: "#9F7AEA", // Morado vibrante cuando está seleccionado
    borderColor: "#9F7AEA", // Borde del mismo color
  },
  compactSelectionButtonText: {
    color: "#E2E8F0", // Texto claro por defecto
    fontSize: 13,
    fontWeight: "500",
  },
  compactSelectionButtonTextSelected: {
    color: "#FFFFFF", // Texto blanco para la opción seleccionada
    fontWeight: "bold",
  }, // *** FIN ESTILOS BOTONES DE SELECCIÓN ***
  compactStatusOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
    width: "100%",
    paddingHorizontal: 0,
  },
  compactStatusOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#667EEA", // Borde azul vibrante
    backgroundColor: "#2B3B6D", // Azul oscuro suave
    marginHorizontal: 4,
  },
  compactStatusOptionSelected: {
    backgroundColor: "#667EEA", // Azul vibrante
    borderColor: "#667EEA",
  },
  compactStatusText: {
    color: "#EBF4FF", // Texto azul muy claro
    fontWeight: "600",
    fontSize: 13,
  },
  compactStatusTextSelected: {
    color: "white",
    fontWeight: "700",
  }, // Estilos para el selector de horas

  timePickerScrollView: {
    maxHeight: 200,
    marginBottom: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#4A5568",
    borderRadius: 8,
    backgroundColor: "#2D3748",
    color: "#ffffffff",
  },
  timePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4A5568",
    alignItems: "center",
    color: "#ffffffff",
  },
  timePickerOptionSelected: {
    backgroundColor: "#4A5568",
    color: "#ffffffff",
  },
  timePickerOptionText: {
    fontSize: 16,
    color: "#ffffffff",
  },
  timePickerOptionTextSelected: {
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: "bold",
  },
  noHoursText: {
    textAlign: "center",
    color: "#A0AEC0",
    marginVertical: 16,
    fontSize: 15,
  },
  celdaBase: {
    height: 60, // 60px for each 30 minutes, adjust as needed
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
    width: "100%",
  },

  userSuggestionsContainer: {
    position: "absolute",
    top: 300, // Ajustado para bajar más la lista y que se vea lo que se escribe
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    maxHeight: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userSuggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  userSuggestionText: {
    fontSize: 16,
    color: "#4A5568",
  },
  // Estilos para sugerencias de usuarios

  userSuggestionsScrollView: {
    flexGrow: 1,
  }, // Estilos para el modal de pago

  paymentOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 12,
    width: "100%",
  },
  paymentOptionButton: {
    backgroundColor: "#4A5568",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#667EEA",
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E2E8F0",
  }, // Botones de acción del modal

  compactSaveButton: {
    backgroundColor: "#38A169", // Verde esmeralda
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    shadowColor: "#38A169",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  compactSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  compactCancelButton: {
    backgroundColor: "#A0AEC0", // Gris medio para el botón de cancelar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
    shadowColor: "#A0AEC0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  compactCancelButtonText: {
    color: "#2D3748", // Texto oscuro para contraste
    fontSize: 16,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.7,
  }, // Sección de citas fuera de horario

  outOfHoursContainer: {
    padding: 16,
    marginTop: 20,
    backgroundColor: "#2D3748",
    borderTopWidth: 1,
    borderTopColor: "#4A5568",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  outOfHoursTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#E2E8F0",
  },
  outOfHoursCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#1A202C",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  outOfHoursDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  outOfHoursTime: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#9F7AEA",
  },
  outOfHoursText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#E2E8F0",
  },
  dateSelectorContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  dateSelectorButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dateSelectorButtonSelected: {
    backgroundColor: "#FC8181", // Color de acento
  },
  dateSelectorText: {
    color: "#E2E8F0",
    fontSize: 14,
  },
  dateSelectorTextSelected: {
    color: "#1A202C", // Color de texto para el botón seleccionado
    fontWeight: "bold",
  },
  calendar: {
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  outOfHoursPeluquero: {
    fontSize: 12,
    color: "#A0AEC0",
  },

  outOfHoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
},
addOutOfHoursButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568', // Un color oscuro y sutil
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
},
addOutOfHoursButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
},
});
