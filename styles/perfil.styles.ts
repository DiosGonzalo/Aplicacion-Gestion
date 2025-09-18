import { StyleSheet } from 'react-native';

// --- PALETA DE COLORES Y CONSTANTES GLOBALES MEJORADAS PARA LA PANTALLA DE PERFIL ---
const ProfileColors = {
  // Fondos
  backgroundPrimary: '#0F0F0F',
  backgroundSecondary: '#1F1F1F', // Gris oscuro profundo para tarjetas y secciones
  backgroundTertiary: '#0e0d0dff', // Gris ligeramente más claro para ítems interactivos (botones, slots)

  // Textos
  textPrimary: '#FFFFFF', // Blanco puro para texto principal y títulos
  textSecondary: '#E0E0E0', // Gris claro para texto secundario, labels
  textPlaceholder: '#B0B0B0', // Gris más claro para placeholders de input
  textDisabled: '#616161', // Gris para texto deshabilitado

  // Colores de Acento - Profesionales y sutiles
  accentPrimary: '#7B68EE',

  accentBlue: '#007BFF', // Azul
  accentGreen: '#1E843A', // Verde más oscuro para acciones de éxito (guardar)
  accentRed: '#B92C3A', // Rojo menos vibrante para acciones de peligro

  // Bordes y líneas
  borderColorLight: '#424242',
  borderColorMedium: '#616161',

  // Sombras
  shadowColorLight: 'rgba(255, 255, 255, 0.05)',
  shadowColorMedium: 'rgba(255, 255, 255, 0.1)',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileColors.backgroundTertiary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: ProfileColors.backgroundTertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginBottom: 25,
    borderBottomWidth: 0,
  },
  headerIcon: {
    marginRight: 12,
    color: ProfileColors.accentPrimary,
    fontSize: 30,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ProfileColors.backgroundTertiary,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 17,
    color: ProfileColors.textSecondary,
  },
  card: {
    backgroundColor: ProfileColors.backgroundSecondary,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: ProfileColors.shadowColorLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: ProfileColors.textSecondary,
    marginBottom: 10,
    marginTop: 20,
  },
  emailText: {
    fontSize: 17,
    color: ProfileColors.textPrimary,
    backgroundColor: ProfileColors.backgroundTertiary,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ProfileColors.borderColorLight,
    marginBottom: 20,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: ProfileColors.borderColorMedium,
    padding: 15,
    borderRadius: 12,
    fontSize: 17,
    color: ProfileColors.textPrimary,
    marginBottom: 20,
    backgroundColor: ProfileColors.backgroundSecondary,
    shadowColor: ProfileColors.shadowColorLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    borderColor: ProfileColors.accentBlue,
    shadowColor: ProfileColors.accentBlue,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveIndicator: {
    marginTop: 25,
  },
  saveButton: {
    backgroundColor: ProfileColors.accentGreen,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    shadowColor: ProfileColors.accentGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  saveButtonPressed: {
    backgroundColor: '#16692b', // Verde más oscuro al presionar
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF', // Color del texto blanco
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButtonContainer: {
    marginTop: 'auto',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: ProfileColors.accentRed,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ProfileColors.accentRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  logoutButtonPressed: {
    backgroundColor: '#8d222e', // Rojo más oscuro al presionar
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: '45%', // Ajustado para que quepan los dos botones
    marginBottom: 10,
    backgroundColor: ProfileColors.accentRed, // Rojo para indicar acción de eliminar
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ProfileColors.accentRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // --- ESTILOS NUEVOS ---
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  passwordResetButton: {
    width: '45%',
    backgroundColor: ProfileColors.accentBlue,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ProfileColors.accentBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  passwordResetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  passwordResetIndicator: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});