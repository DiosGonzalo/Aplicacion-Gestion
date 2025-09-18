import { StyleSheet } from 'react-native';

// Define una constante con los colores que necesitas directamente aquí
// Asegúrate de que estos valores coincidan con tus ClientColors reales
const LocalClientColors = {
  backgroundPrimary: '#1a1a1a', // Ejemplo: Ajusta a tus colores reales
  backgroundSecondary: '#2a2a2a', // Ejemplo
  backgroundTertiary: '#3a3a3a', // Ejemplo
  textLight: '#f0f0f0',      // Ejemplo
  textMedium: '#b0b0b0',     // Ejemplo
  accentPrimary: '#007bff',  // Ejemplo
  accentDanger: '#dc3545',   // Ejemplo
  shadowColorDark: '#000000', // Ejemplo: Este es el que nos daba problema
  // Añade todos los colores de ClientColors que uses en este archivo
};

export const localStyles = StyleSheet.create({
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: LocalClientColors.backgroundPrimary,
  },
    backButton: {
    position: 'absolute',
    left: 20,
    top: 15,
    zIndex: 1, // Asegura que el botón esté encima del título
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: LocalClientColors.textMedium,
  },
  card: {
    backgroundColor: LocalClientColors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: LocalClientColors.shadowColorDark, // Usando la constante local
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: LocalClientColors.textLight,
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    color: LocalClientColors.textMedium,
    marginTop: 15,
    marginBottom: 10,
  },
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: LocalClientColors.backgroundTertiary,
    marginHorizontal: 5,
    flexShrink: 0,
  },
  dayButtonSelected: {
    backgroundColor: LocalClientColors.accentPrimary,
  },
  dayButtonText: {
    color: LocalClientColors.textLight,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF', // Este es un color fijo, no requiere LocalClientColors
    fontWeight: '700',
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LocalClientColors.backgroundTertiary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  slotText: {
    color: LocalClientColors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 5,
  },
  noHoursText: {
    color: LocalClientColors.textMedium,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  newSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  timeInput: {
    flex: 1,
    backgroundColor: LocalClientColors.backgroundTertiary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: LocalClientColors.textLight,
    fontSize: 16,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  timeSeparator: {
    color: LocalClientColors.textMedium,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 10,
    padding: 5,
  },
  dayOffToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LocalClientColors.backgroundTertiary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dayOffToggleText: {
    color: LocalClientColors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  closedDayText: {
    color: LocalClientColors.textMedium,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  infoText: {
    color: LocalClientColors.textMedium,
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
  },
});