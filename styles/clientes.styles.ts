import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A202C',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1A202C',
  },
  filterMenuContainer: {
    width: '16%',
    padding: 10,
    backgroundColor: '#2D3748',
    borderRightWidth: 1,
    borderRightColor: '#4A5568',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  twoColumnLayout: {
    flex: 1,
    flexDirection: 'row', // Esto hace que los hijos se coloquen en fila (uno al lado del otro)
  },

  // Estilos para la columna izquierda (buscador y filtros)
  leftColumn: {
    flex: 1, // Ocupa 1/3 del espacio disponible
    padding: 15,
    backgroundColor: '#2D3748', // Color de fondo para distinguirlo
    borderRightWidth: 1, // Borde para separar las columnas
    borderRightColor: '#ccc',
  },

  // Estilos para la columna derecha (tabla de clientes)
  rightColumn: {
    flex: 2, // Ocupa 2/3 del espacio disponible
    padding: 15,
  },
  
  // Estilos de la tabla, ajustados para la nueva estructura
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerText: {
    
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clienteRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowText: {
    fontSize: 14,
    color: '#ffffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
    color: '#CBD5E0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#ffffffff',
    fontSize: 16,
  },
  clearSearchIcon: {
    marginLeft: 8,
    color: '#CBD5E0',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginTop: 15,
    marginBottom: 5,
  },
  reputacionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reputacionButton: {
    backgroundColor: '#4A5568',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  activeReputacionButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  reputacionButtonText: {
    color: '#CBD5E0',
    fontSize: 14,
  },
  activeReputacionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  reputacionBuena: {
    color: '#48BB78', // Verde
  },
  reputacionRegular: {
    color: '#ECC94B', // Amarillo
  },
  reputacionMala: {
    color: '#E53E3E', // Rojo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#CBD5E0',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    borderWidth: 1,
    borderColor: '#4A5568',
    borderRadius: 10,
    backgroundColor: '#2D3748',
  },
  emptyListText: {
    marginTop: 15,
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});