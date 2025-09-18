import { StyleSheet } from 'react-native';

// --- PALETA DE COLORES Y CONSTANTES GLOBALES MEJORADAS PARA LA PANTALLA DE PERFIL ---
const ClientColors = {
  // Fondos
  backgroundPrimary: '#1A202C', // Negro muy oscuro, casi absoluto para un look de lujo
  backgroundSecondary: '#1F1F1F', // Gris oscuro profundo para tarjetas y secciones
  backgroundTertiary: '#2A2A2A', // Gris ligeramente más claro para ítems interactivos (botones, slots)

  // Textos
  textLight: '#EFEFEF', // Blanco roto para texto principal y títulos
  textMedium: '#B0B0B0', // Gris claro para texto secundario, etiquetas
  textDark: '#4A4A4A', // Gris oscuro para texto deshabilitado o de contraste bajo

  // Colores de Acento - Vibrantes y profesionales
  accentPrimary: '#7B68EE', // Un azul-púrpura real, vibrante y premium (para seleccionado, iconos clave)
  accentSecondary: '#3CB371', // Verde esmeralda para acciones de éxito (guardar)
  accentDanger: '#FF6347', // Rojo vibrante para acciones de peligro (cerrar sesión)

  // Bordes y líneas
  borderColorLight: '#3A3A3A', // Gris oscuro para bordes sutiles
  borderColorMedium: '#4A4A4A', // Gris medio para bordes de input

  // Sombras
  shadowColorDark: 'rgba(0, 0, 0, 0.8)', // Sombra más oscura y envolvente

  // Deshabilitado
  disabledGray: '#3A3A3A', // Gris oscuro para botones deshabilitados
  disabledText: '#666666', // Color de texto para elementos deshabilitados

  // Colores de estado para informes (si se usan aquí también)
  statusPendingBg: 'rgba(255,215,0,0.3)', // Dorado suave con transparencia
  statusPendingText: '#FFD700', // Dorado vibrante
  statusCompletedBg: 'rgba(60,179,113,0.3)', // Verde esmeralda suave con transparencia
  statusCompletedText: '#3CB371', // Verde esmeralda vibrante
  statusCancelledBg: 'rgba(255,99,71,0.3)', // Rojo coral suave con transparencia
  statusCancelledText: '#FF6347', // Rojo coral vibrante
};

export const styles = StyleSheet.create({
  // --- Estilos generales de la pantalla de Administración ---
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ClientColors.backgroundPrimary,
  },
  title: {
    marginTop: 50,
    fontSize: 28,
    marginBottom: 40,
    fontWeight: '700',
    color: ClientColors.textLight,
    textShadowColor: ClientColors.shadowColorDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: ClientColors.borderColorMedium,
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: ClientColors.backgroundTertiary,
    color: ClientColors.textLight,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ClientColors.accentPrimary, // Azul-púrpura para login
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: ClientColors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    width: '90%',
    marginTop: 10,
  },
  loginText: {
    color: ClientColors.textLight,
    fontSize: 17,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ClientColors.accentDanger, // Rojo vibrante para cerrar sesión
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: ClientColors.accentDanger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    width: '90%',
    marginBottom: 20,
  },
  logoutText: {
    color: ClientColors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ClientColors.backgroundSecondary, // Gris oscuro para opciones administrativas
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    width: '90%',
  },
  adminOptionText: {
    color: ClientColors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    flex: 1,
  },
  errorText: {
    color: ClientColors.accentDanger,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  adminOptionIcon: {
    marginRight: 10,
    color: ClientColors.accentPrimary, // Morado vibrante para iconos de admin
  },
  logoutIcon: {
    marginRight: 10,
    color: ClientColors.textLight, // Blanco para el icono de cerrar sesión
  },

  // --- Estilos ESPECÍFICOS para la pantalla de Informes (informes.tsx) ---
  reportsModalBackground: { // Ahora es el fondo de la pantalla de informes
    flex: 1,
    backgroundColor: ClientColors.backgroundPrimary,
  },
  reportsModalContainer: { // Ahora es el contenedor principal de la pantalla de informes
    flex: 1,
    marginHorizontal: 0, // No hay margen en una pantalla completa
    backgroundColor: ClientColors.backgroundPrimary, // Fondo principal
    borderRadius: 0, // No hay bordes redondeados en una pantalla completa
    padding: 20,
    alignItems: 'center',
    shadowColor: 'transparent', // Sin sombra en el contenedor principal
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  reportsModalCloseButton: { // Ahora es el botón de retroceso
    position: 'absolute',
    top: 40, // Ajustar posición
    left: 20, // Ajustar posición
    zIndex: 1,
    padding: 10,
  },
  reportsModalCloseButtonIcon: {
    color: ClientColors.textLight, // Color del icono de cerrar/retroceder
  },
  reportsModalTitle: { // Título de la pantalla de informes
    fontSize: 30,
    fontWeight: '700',
    color: ClientColors.textLight,
    marginBottom: 25,
    textAlign: 'center',
    marginTop: 60, // Espacio desde arriba
  },

  // Estilos de las pestañas de informe
  reportTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
    backgroundColor: ClientColors.backgroundSecondary, // Fondo para el contenedor de pestañas
    borderRadius: 15,
    padding: 8,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  reportTabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10, // Bordes redondeados para cada pestaña
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4, // Espacio entre pestañas
    backgroundColor: ClientColors.backgroundTertiary, // Fondo de pestaña inactiva
  },
  reportTabButtonPressed: {
    opacity: 0.8, // Feedback al presionar
    transform: [{ scale: 0.98 }],
  },
  reportTabButtonActive: {
    backgroundColor: ClientColors.accentPrimary, // Fondo de pestaña activa
    shadowColor: ClientColors.accentPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  reportTabButtonText: {
    color: ClientColors.textMedium, // Texto de pestaña inactiva
    fontSize: 16,
    fontWeight: '600',
  },
  reportTabButtonTextActive: {
    color: ClientColors.textLight, // Texto de pestaña activa
    fontWeight: 'bold',
  },

  // Estilos para el contenido del informe (ScrollView)
  reportScrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10, // Padding dentro del scrollview
  },
  reportLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  reportLoadingText: {
    marginTop: 20,
    fontSize: 18,
    color: ClientColors.textMedium,
  },
  reportEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 20,
    marginTop: 30,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  reportEmptyText: {
    marginTop: 15,
    fontSize: 18,
    color: ClientColors.textMedium,
    textAlign: 'center',
  },

  // Estilos para las secciones del informe
  reportSectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ClientColors.textLight,
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: ClientColors.shadowColorDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reportSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los ítems se envuelvan si no caben
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  reportSummaryItem: {
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
    margin: 8, // Margen alrededor de cada ítem de resumen
    flex: 1, // Permite que los ítems crezcan
    minWidth: '45%', // Ancho mínimo para dos columnas
    maxWidth: '48%', // Ancho máximo para dos columnas
    alignItems: 'center',
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  reportSummaryLabel: {
    fontSize: 15,
    color: ClientColors.textMedium,
    marginBottom: 5,
    textAlign: 'center',
  },
  reportSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ClientColors.accentPrimary, // Color de acento para los valores
    textAlign: 'center',
  },

  // Estilos para el desglose por peluquero
  peluqueroReportItem: {
    backgroundColor: ClientColors.backgroundTertiary,
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    marginHorizontal: 5,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  peluqueroReportName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ClientColors.textLight,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ClientColors.textDark, // Borde sutil
    paddingBottom: 5,
  },
  peluqueroReportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peluqueroReportText: {
    fontSize: 15,
    color: ClientColors.textMedium,
  },
  peluqueroReportValue: {
    fontWeight: 'bold',
    color: ClientColors.accentSecondary, // Verde para los valores de ingresos/citas
  },

  // Estilos para el botón de retroceso en informes
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
 
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#333',
    },
 
});
