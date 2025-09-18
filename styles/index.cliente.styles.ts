import { Dimensions, StyleSheet } from "react-native";

// Obtener el ancho de la ventana para cálculos de diseño responsivo
const { width } = Dimensions.get("window");

// --- PALETA DE COLORES Y CONSTANTES GLOBALES MEJORADAS PARA LA UX DEL CLIENTE ---
export const ClientColors = {
  // Fondos
  backgroundPrimary: "#0F0F0F",
  backgroundSecondary: "#1F1F1F", // Gris oscuro profundo para tarjetas y secciones
  backgroundTertiary: "#2A2A2A", // Gris ligeramente más claro para ítems interactivos (botones, slots)

  // Textos
  textLight: "#EFEFEF",
  textMedium: "#B0B0B0", // Gris claro para texto secundario, etiquetas
  textDark: "#4A4A4A", // Gris oscuro para texto deshabilitado o de contraste bajo

  // Colores de Acento - Más vibrantes y sofisticados
  accentPrimary: "#7B68EE",
  accentSecondary: "#3CB371", // Asegúrate de que este esté definido si lo usas en el botón
  accentDanger: "#FF6347", // Rojo coral para estados de peligro/ocupado (más suave que rojo puro)
  accentRefresh: "#4682B4", // Azul acero para el botón de refrescar

  // Sombras
  shadowColorDark: "#000",

  // Deshabilitado
  disabledGray: "#6C6C6C", // Gris para botones deshabilitados
};

// --- Estilos para el Selector de Horas (Time Slot Picker) ---
export const timeSlotPickerStyles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 }, // Ajustado
    shadowOpacity: 0.2, // Ajustado
    shadowRadius: 8, // Ajustado
    elevation: 5, // Ajustado
    borderWidth: 0, // Eliminar borde para un look más limpio
  },
  loadingText: {
    marginTop: 15,
    color: ClientColors.textLight,
    fontSize: 18,
    fontWeight: "600",
  },

  scrollContainer: {
    flexGrow: 0,
    width: "100%",
    maxHeight: 180, // Más alto para mejor visualización
    borderRadius: 20, // Más redondeado
    marginBottom: 25, // Más espacio
    backgroundColor: ClientColors.backgroundSecondary, // Fondo del contenedor de horas
    paddingVertical: 10, // Más padding
    paddingHorizontal: 5,
    // Sombra más profunda para que "flote"
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: ClientColors.backgroundTertiary, // Fondo de slot disponible
    borderRadius: 15, // Más redondeado
    paddingVertical: 15, // Más padding
    paddingHorizontal: 12,
    marginHorizontal: 8, // Más margen entre slots
    width: 100, // Ligeramente más ancho
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent", // Borde transparente por defecto, se activa en estados
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    // Propiedad para la animación de transición
    transitionProperty:
      "background-color, border-color, shadow-opacity, shadow-radius, elevation",
    transitionDuration: "0.3s", // Animación suave
  },
  timeSlotPressed: {
    backgroundColor: ClientColors.textDark, // Gris muy oscuro al presionar
    borderColor: ClientColors.accentPrimary,
    transform: [{ scale: 0.98 }], // Pequeña escala para feedback táctil
  },
  timeSlotSelected: {
    backgroundColor: ClientColors.accentPrimary, // Azul-púrpura para seleccionado
    borderColor: ClientColors.accentPrimary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  timeSlotOccupied: {
    backgroundColor: ClientColors.accentDanger, // Rojo coral para ocupado
    borderColor: ClientColors.accentDanger,
    opacity: 0.9, // Ligeramente más opaco para ser claro
  },
  timeSlotDisabled: {
    backgroundColor: ClientColors.backgroundPrimary, // Fondo más oscuro para deshabilitado
    borderColor: ClientColors.textDark,
    opacity: 0.6,
  },
  timeSlotText: {
    color: ClientColors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: ClientColors.textLight, // Mantenemos el texto claro en el seleccionado
    fontWeight: "bold",
  },
  timeSlotTextDisabled: {
    color: ClientColors.textDark, // Gris más oscuro para deshabilitado
    textDecorationLine: "line-through",
  },
});

// --- Estilos principales de la pantalla de Reservas ---
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClientColors.backgroundPrimary,
    paddingHorizontal: 0, // Padding gestionado por scrollViewContent
    paddingTop: 0, // Padding gestionado por scrollViewContent
  },
  safeArea: {
    flex: 1,
    backgroundColor: ClientColors.backgroundPrimary,
  },
  scrollViewContent: {
    paddingHorizontal: 20, // Padding horizontal aplicado aquí
    paddingVertical: 20, // Padding superior e inferior
    paddingBottom: 40, // Más padding al final
  },
  header: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 25,
    marginBottom: 30, // Más espacio debajo del header
  },
  headerIcon: {
    marginRight: 15, // Más espacio para el icono
    color: ClientColors.accentPrimary, // Icono de acento
    fontSize: 30, // Más grande
  },
  repeatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ClientColors.accentPrimary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 32, // Un poco más grande
    fontWeight: "700",
    color: ClientColors.textLight,
  },
  welcomeText: {
    textAlign: "center",
    position: "absolute",
    top: 15, // Ajustado
    right: 0,
    fontSize: 15,
    color: ClientColors.textMedium,
    fontStyle: "italic",
  },
  loadingContainer: {
    paddingVertical: 50, // Aumentar padding para centrar mejor
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ClientColors.backgroundPrimary, // Fondo primario para un look más integrado
    borderRadius: 0, // Sin bordes para un look limpio, ocupando toda la pantalla
    // Eliminar marginHorizontal para que ocupe todo el ancho
    // Sombra más sutil y difusa
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 }, // Menos desplazamiento
    shadowOpacity: 0.2, // Menos opacidad
    shadowRadius: 8, // Menos radio
    elevation: 5, // Menos elevación
    // Eliminar borderWidth y borderColor para un look más limpio
    flex: 1, // Para que ocupe todo el espacio disponible
    width: "100%", // Asegurarse de que ocupe todo el ancho
    height: "100%", // Asegurarse de que ocupe toda la altura
    position: "absolute", // Para que se superponga al contenido
    zIndex: 999, // Asegurarse de que esté por encima de otros elementos
  },
  loadingText: {
    marginTop: 20, // Más margen superior
    color: ClientColors.textLight,
    fontSize: 20, // Ligeramente más grande
    fontWeight: "700", // Más negrita
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60, // Más margen
    padding: 30, // Más padding
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 20, // Más redondeado
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 10,
  },
  emptyStateText: {
    fontSize: 18,
    color: ClientColors.textLight,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
    lineHeight: 26, // Mejor legibilidad
  },
  refreshButton: {
    backgroundColor: ClientColors.accentRefresh, // Azul acero para refrescar
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: ClientColors.accentRefresh,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  refreshButtonText: {
    color: ClientColors.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 25, // Aún más redondeado
    padding: 30, // Más padding
    marginBottom: 35, // Más espacio entre tarjetas
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 10 }, // Sombra profunda
    shadowOpacity: 0.45,
    shadowRadius: 20, // Sombra más difusa
    elevation: 15,
  },
  cardTitle: {
    fontSize: 24, // Más grande
    fontWeight: "700",
    color: ClientColors.textLight,
    marginBottom: 25, // Más espacio
    textAlign: "center",
    textShadowColor: ClientColors.shadowColorDark, // Sombra de texto
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  label: {
    fontSize: 18, // Más grande
    fontWeight: "600",
    color: ClientColors.textMedium,
    marginBottom: 15, // Más espacio
    marginTop: 25, // Más margen
  },
  input: {
    borderWidth: 1,
    borderColor: ClientColors.backgroundTertiary, // Borde que combine
    padding: 15,
    borderRadius: 12,
    fontSize: 17,
    color: ClientColors.textLight,
    marginBottom: 20,
    backgroundColor: ClientColors.backgroundTertiary,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  // --- Estilos para Peluquero FlatList ---
  peluqueroListContainer: {
    paddingVertical: 15, // Más padding
    paddingHorizontal: 0,
  },
  peluqueroItem: {
    alignItems: "center",
    marginHorizontal: 12, // Más margen
    padding: 15,
    borderRadius: 18, // Más redondeado
    backgroundColor: ClientColors.backgroundTertiary,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    width: 140, // Ligeramente más ancho
    transitionProperty:
      "background-color, border-color, shadow-opacity, shadow-radius, elevation, transform",
    transitionDuration: "0.3s",
  },
  peluqueroItemSelected: {
    backgroundColor: ClientColors.accentPrimary, // Azul-púrpura para seleccionado
    borderColor: ClientColors.textLight, // Borde blanco en seleccionado
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.05 }], // Efecto de escala al seleccionar
  },
  peluqueroImage: {
    width: 80, // Más grande
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderColor: ClientColors.textLight, // Borde de acento
    borderWidth: 3, // Borde más grueso
  },
  peluqueroName: {
    fontSize: 16, // Más grande
    fontWeight: "600",
    color: ClientColors.textLight,
    textAlign: "center",
    marginTop: 5,
  },
  peluqueroNameSelected: {
    color: ClientColors.textLight, // Mantenemos el texto claro
    fontWeight: "bold",
  },

  // --- Estilos para Servicio FlatList ---
  servicioListContainer: {
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  servicioItem: {
    alignItems: "center",
    marginHorizontal: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: ClientColors.backgroundTertiary,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    width: 150, // Ligeramente más ancho
    transitionProperty:
      "background-color, border-color, shadow-opacity, shadow-radius, elevation, transform",
    transitionDuration: "0.3s",
  },
  servicioItemSelected: {
    backgroundColor: ClientColors.accentPrimary,
    borderColor: ClientColors.textLight,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  servicioIcon: {
    marginBottom: 10,
    color: ClientColors.accentPrimary, // Icono de acento
    fontSize: 40, // Ícono más grande
  },
  servicioName: {
    fontSize: 16,
    fontWeight: "600",
    color: ClientColors.textLight,
    textAlign: "center",
  },
  servicioNameSelected: {
    color: ClientColors.textLight,
    fontWeight: "bold",
  },
  servicioPrice: {
    fontSize: 14, // Más grande
    color: ClientColors.textMedium,
    marginTop: 8,
    fontWeight: "500",
  },
  servicioPriceSelected: {
    color: ClientColors.textLight,
    fontWeight: "bold",
  },

  dateButton: {
    backgroundColor: ClientColors.backgroundSecondary,
    padding: 20, // Más padding
    borderRadius: 18, // Más redondeado
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25, // Más espacio
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  dateButtonIcon: {
    marginRight: 15,
    color: ClientColors.accentPrimary,
    fontSize: 28, // Más grande
  },
  dateButtonText: {
    color: ClientColors.textLight,
    fontSize: 20, // Más grande
    fontWeight: "bold",
  },
  // Estilos para el Date Picker horizontal
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30, // Más espacio
    paddingHorizontal: 0,
  },
  monthYearText: {
    fontSize: 24, // Más grande
    fontWeight: "bold",
    color: ClientColors.textLight,
  },
  dateNavButton: {
    backgroundColor: ClientColors.textLight,
    borderRadius: 15,
    padding: 12, // Más padding
    color: ClientColors.textLight,
  },

  dateNavButtonText: {
    color: ClientColors.accentPrimary,
    fontSize: 30, // Más grandes
  },
  dateListContainer: {
    paddingVertical: 15,
  },
  dateItem: {
    width: width / 7 - 14, // Ajustar para 7 días con buen margen
    height: 80, // Ligeramente más alto
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: ClientColors.backgroundTertiary,
    borderWidth: 1,
    borderColor: "transparent",
    transitionProperty:
      "background-color, border-color, shadow-opacity, shadow-radius, elevation, transform",
    transitionDuration: "0.3s",
  },
  dateItemSelected: {
    backgroundColor: ClientColors.accentPrimary,
    borderColor: ClientColors.textLight, // Borde blanco en seleccionado
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 7,
    transform: [{ scale: 1.05 }],
  },
  dateItemDisabled: {
    backgroundColor: ClientColors.backgroundPrimary,
    borderColor: ClientColors.textDark,
    opacity: 0.7,
  },
  dateText: {
    fontSize: 22,
    fontWeight: "bold",
    color: ClientColors.textLight,
  },
  dateTextSelected: {
    color: ClientColors.textLight,
  },
  dateTextDisabled: {
    color: ClientColors.textDark,
  },
  dayText: {
    fontSize: 14, // Más grande
    color: ClientColors.textMedium,
    marginTop: 5,
    fontWeight: "500",
  },
  dayTextSelected: {
    color: ClientColors.textLight,
    fontWeight: "bold",
  },
  dayTextDisabled: {
    color: ClientColors.textDark,
  },
  // Estilos para la sección de resumen de la reserva
  bookingSummaryCard: {
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 25,
    padding: 30,
    marginTop: 35,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 15,
  },
  bookingSummaryText: {
    fontSize: 20, // Más grande
    color: ClientColors.textLight,
    fontWeight: "600",
    marginLeft: 15, // Más espacio
  },
  bookingSummaryIcon: {
    color: ClientColors.accentPrimary,
    fontSize: 30, // Más grande
  },
  reserveButton: {
    // Aquí iría el LinearGradient en el JSX
    padding: 22, // Más padding
    borderRadius: 18, // Más redondeado
    backgroundColor: "#FFFFFF", // Fondo blanco para el botón
    alignItems: "center",
    color: ClientColors.textLight,
    marginTop: 45, // Más margen superior
    // Sombra del color del acento principal
    shadowColor: ClientColors.accentSecondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 18,
    width: "100%",
    transitionProperty: "opacity", // Para el press feedback
    transitionDuration: "0.2s",
  },
  reserveButtonPressed: {
    opacity: 0.9, // Ligeramente transparente al presionar
    transform: [{ scale: 0.99 }], // Pequeña escala para feedback táctil
  },
  reserveButtonDisabled: {
    backgroundColor: ClientColors.disabledGray,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  reserveButtonText: {
    fontSize: 24, // Más grande y prominente
    fontWeight: "bold",
    textShadowColor: ClientColors.shadowColorDark, // Sombra de texto
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  loadingImage: {
    borderRadius: 30,
    width: 200, // Ajusta el ancho de tu imagen según sea necesario
    height: 200, // Ajusta la altura de tu imagen según sea necesario
    marginBottom: 20,
  },
});
