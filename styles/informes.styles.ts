import { StyleSheet } from 'react-native';

export const reportsStyles = StyleSheet.create({
  // Colores principales de index.admin.styles.ts:
  // Background principal: #1A202C (Gris oscuro profundo)
  // Contenedores/Cards: #2D3748 (Gris oscuro medio)
  // Bordes/Separadores: #4A5568 (Gris azulado más oscuro)
  // Texto claro: #E2E8F0
  // Texto medio: #A0AEC0
  // Acentos (seleccionado/éxito): #9F7AEA (Morado), #38A169 (Verde)
  // Error: #E53E3E

  safeArea: {
    flex: 1,
    backgroundColor: '#1A202C', // Fondo principal oscuro
  },
  agendaScrollViewContent: { // Contenido del ScrollView con padding para el contenido
    paddingVertical: 10,
    paddingHorizontal: 15, // Más padding horizontal para que los elementos no toquen los bordes
  },

  // Estilos de texto y títulos
  compactModalTitle: { // Usado para el título principal "Informes de la Tienda"
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E2E8F0', // Texto claro
    textAlign: 'center',
    marginTop: 15,
  },
  compactLabel: {
    fontSize: 14, // Ligeramente más pequeño para labels
    fontWeight: '600',
    color: '#A0AEC0', // Gris medio para el label
    marginBottom: 6,
    marginTop: 12,
    width: '100%',
    textAlign: 'left',
  },
  compactInput: { // Estilo de TextInput
    borderWidth: 1,
    borderColor: '#4A5568', // Borde oscuro similar a index.admin.styles.ts
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: '#E2E8F0', // Texto claro
    marginBottom: 12,
    width: '100%',
    backgroundColor: '#2D3748', // Fondo oscuro para inputs
  },
  compactDateInput: { // Ajustes para el botón de fecha
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row', // Para mostrar texto y quizás un icono
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 44, // Asegura un tamaño mínimo
  },

  // Contenedores de botones de opciones (Semanal, Mensual, Todos, Peluquero A, etc.)
  compactOptionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los botones se envuelvan a la siguiente línea
    justifyContent: 'flex-start',
    marginBottom: 15,
    width: '100%',
    marginTop: 5,
  },
  compactSelectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // Forma de píldora
    borderWidth: 1,
    borderColor: '#4A5568', // Borde oscuro
    backgroundColor: '#2D3748', // Fondo oscuro para los botones
    marginRight: 8,
    marginBottom: 8,
  },
  compactSelectionButtonSelected: {
    backgroundColor: '#9F7AEA', // Morado vibrante cuando está seleccionado
    borderColor: '#9F7AEA', // Borde del mismo color
  },
  compactSelectionButtonText: {
    color: '#E2E8F0', // Texto claro por defecto
    fontSize: 13,
    fontWeight: '500',
  },
  compactSelectionButtonTextSelected: {
    color: '#FFFFFF', // Texto blanco para la opción seleccionada
    fontWeight: 'bold',
  },

  // Estados de carga y error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: '#1A202C', // Coincide con safeArea
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#CBD5E0', // Texto gris claro para contraste
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#3C1F2E', // Rojo oscuro muy sutil
    borderColor: '#E53E3E', // Rojo más vibrante para el borde
    borderWidth: 1,
    marginHorizontal: 15,
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#E53E3E', // Sombra con color de error
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  errorText: {
    color: '#FBD38D', // Amarillo suave para el texto de error
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#2D3748', // Gris oscuro medio
    marginHorizontal: 15, // Reducir margen para más espacio
    borderRadius: 12, // Menos redondeado para un look más compacto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 19,
    color: '#FC8181', // Rojo suave pero visible para advertencia
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '800',
    lineHeight: 26,
  },

  // Contenedores de secciones y filtros
  filterSection: {
    backgroundColor: '#2D3748', // Fondo oscuro para las secciones de filtro
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 0, // El padding horizontal del ScrollView ya lo maneja
  },
  datePickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  reportsContentContainer: {
    // Este contenedor es principalmente para aplicar sombras y un poco de margen visual
  },

  // KPI Cards (tarjetas resumen en la parte superior)
  kpiCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  kpiCard: {
    backgroundColor: '#2D3748', // Fondo oscuro para las KPI cards
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  kpiTitle: {
    fontSize: 13,
    color: '#A0AEC0', // Texto gris medio
    marginTop: 5,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E2E8F0', // Texto claro
    marginTop: 5,
  },
  kpiChange: { // Opcional, si añades la funcionalidad de cambio
    fontSize: 12,
    color: '#38A169', // Verde para cambios positivos
    marginTop: 5,
    fontWeight: '600',
  },

  // Tarjetas generales para reportes (Servicios más populares, Rendimiento por Peluquero)
  card: {
    backgroundColor: '#2D3748', // Fondo oscuro para las tarjetas
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E2E8F0', // Texto claro
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568', // Borde oscuro para el separador
    paddingBottom: 10,
  },
  subCard: {
    backgroundColor: '#4A5568', // Un gris azulado más oscuro para sub-cards
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4A5568', // Borde del mismo color
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0', // Texto claro
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#A0AEC0', // Gris medio
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E2E8F0', // Texto claro
    flex: 1,
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 14,
    color: '#A0AEC0', // Gris medio
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },

  // Estilos de tabla para "Detalle de Citas" (haciéndola más bonita)
  
 
 
  // Colores para estados en la tabla, manteniendo la paleta de index.tsx
  completedStatusText: {
    color: '#38A169', // Verde de éxito
    fontWeight: '600',
  },
  
  pendingStatusText: {
    color: '#FBD38D', // Amarillo/naranja de advertencia
    fontWeight: '600',
  },
  canceledStatusText: {
    color: '#E53E3E', // Rojo de error/cancelado
    fontWeight: '600',
  },
   reportsAnalyticsSection: { // <--- THIS STYLE IS IMPORTANT
    // This section holds the main report cards below the KPIs
    marginBottom: 15,
  },

tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A5568', // Fondo de encabezado de tabla más oscuro
    paddingVertical: 12, // Más padding para encabezado
    paddingHorizontal: 15, // Ajusta padding
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748', // Borde oscuro
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#E2E8F0', // Texto claro para encabezados
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12, // Más padding para filas
    paddingHorizontal: 15, // Ajusta padding
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748', // Borde oscuro para separador de fila
    alignItems: 'center',
    backgroundColor: '#2D3748', // Fondo de fila de tabla
  },
  

  
  tableCell: {
    fontSize: 12,
    color: '#A0AEC0', // Texto gris medio para celdas
  },
  // Colores para estados en la tabla, manteniendo la paleta de index.tsx
 
 

  // NEW: Estilos para el encabezado diario en la sección de citas
  dailyHeader: {
    backgroundColor: '#4A5568', // Fondo más oscuro para el encabezado de día
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15, // Espacio antes de cada nuevo día
    marginBottom: 5,
    borderRadius: 8, // Ligeramente redondeado
    borderWidth: 1,
    borderColor: '#5A6372', // Borde sutil
  },
  dailyHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EBF4FF', // Texto muy claro
  },




   summaryCard: {
    backgroundColor: '#2D3748', // Fondo oscuro para la tarjeta
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 15, // Para que tenga el mismo margen que los filterSection
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'space-between', // Para empujar el botón "Ver Más" hacia abajo
    minHeight: 150, // Altura mínima para que se vea sustancial
  },
  summaryTitle: {
    fontSize: 16,
    color: '#A0AEC0', // Texto gris medio
    marginBottom: 5,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 34, // Tamaño grande para el valor principal
    fontWeight: 'bold',
    color: '#E2E8F0', // Texto claro
    marginBottom: 20, // Espacio antes del botón
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end', // Alinearlo a la derecha inferior
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15, // Bordes redondeados para el botón
    backgroundColor: '#4A5568', // Fondo sutil para el botón
  },
  seeMoreButtonText: {
    color: '#9F7AEA', // Morado de acento
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5, // Espacio antes del icono
  },
  exportPdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38A169', // Un verde fuerte para la acción principal
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20, // Espacio superior
    alignSelf: 'center', // Centrar el botón
    width: '100%', // Ocupar todo el ancho disponible dentro del filterSection
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  exportPdfButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Espacio entre el icono y el texto
  },
});
  
