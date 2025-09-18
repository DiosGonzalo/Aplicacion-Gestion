import { StyleSheet } from 'react-native';

// --- PALETA DE COLORES Y CONSTANTES GLOBALES MEJORADAS PARA LA UX DEL CLIENTE ---
const ClientColors = {
  // Fondos
   backgroundPrimary: '#121212', // Fondo oscuro principal para modo oscuro
  backgroundSecondary: '#1E1E1E', // Un poco más claro para las tarjetas y elementos
  backgroundTertiary: '#282828', // Gris más claro para el fondo general

  // Textos
  textLight: '#EFEFEF',
  textMedium: '#B0B0B0',
  textDark: '#4A4A4A',

  // Colores de Acento - Más vibrantes y sofisticados
  accentPrimary: '#7B68EE',
  accentSecondary: '#3CB371',
  accentDanger: '#FF6347',
  accentRefresh: '#4682B4',

  // Colores de estado (mejorados para el tema oscuro)
  statusPendingBg: '#FFD70030',
  statusPendingText: '#FFD700',
  statusCompletedBg: '#3CB37130',
  statusCompletedText: '#3CB371',
  statusCancelledBg: '#FF634730',
  statusCancelledText: '#FF6347',

  // Sombras
  shadowColorDark: 'rgba(0, 0, 0, 0.8)',

  // Deshabilitado
  disabledGray: '#3A3A3A',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ClientColors.backgroundPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: ClientColors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 0,
    position: 'relative',
  },
  headerIcon: {
    marginRight: 10,
    color: ClientColors.accentPrimary,
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: ClientColors.textLight,
  },
  welcomeText: {
    position: 'absolute',
    top: 10,
    right: 0,
    fontSize: 14,
    color: ClientColors.textMedium,
    fontStyle: 'italic',
  },
  // --- NUEVOS ESTILOS PARA EL BONO ---
  bonoContainer: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClientColors.backgroundTertiary, // Un fondo sutil para destacarlo
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bonoText: {
    fontSize: 14,
    fontWeight: '600',
    color: ClientColors.textLight, // Texto blanco para contraste
    marginLeft: 8,
  },
  // ------------------------------------
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ClientColors.backgroundPrimary,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 17,
    color: ClientColors.textMedium,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 30,
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 20,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 10,
  },
  emptyListText: {
    fontSize: 20,
    color: ClientColors.textLight,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  emptyListSubText: {
    fontSize: 16,
    color: ClientColors.textMedium,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: ClientColors.backgroundSecondary,
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    transitionProperty: 'transform, shadow-opacity, shadow-radius, elevation',
    transitionDuration: '0.2s',
  },
  itemCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: ClientColors.backgroundTertiary,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ClientColors.textLight,
    flexShrink: 1,
    marginRight: 15,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusPendiente: {
    backgroundColor: ClientColors.statusPendingBg,
    color: ClientColors.statusPendingText,
  },
  statusCompletada: {
    backgroundColor: ClientColors.statusCompletedBg,
    color: ClientColors.statusCompletedText,
  },
  statusCancelada: {
    backgroundColor: ClientColors.statusCancelledBg,
    color: ClientColors.statusCancelledText,
  },
  itemDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: ClientColors.textMedium,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 10,
    color: ClientColors.accentPrimary,
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: ClientColors.accentDanger,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: ClientColors.accentDanger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    transitionProperty: 'background-color, shadow-opacity, elevation, transform',
    transitionDuration: '0.2s',
  },
  cancelButtonPressed: {
    backgroundColor: '#CC5C47',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  cancelButtonDisabled: {
    backgroundColor: ClientColors.disabledGray,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cancelButtonIcon: {
    marginRight: 12,
    color: ClientColors.textLight,
    fontSize: 22,
  },
  cancelButtonText: {
    color: ClientColors.textLight,
    fontSize: 19,
    fontWeight: 'bold',
    textShadowColor: ClientColors.shadowColorDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // --- Nuevos estilos para el SectionList ---
  sectionHeaderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: ClientColors.backgroundTertiary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: ClientColors.shadowColorDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: ClientColors.textLight,
    textAlign: 'center',
  },
flatListContent: {
    paddingBottom: 20, // Espacio para que el último elemento no toque el borde
},
});