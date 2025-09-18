import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A202C', // Background principal oscuro
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#1A202C', // Background principal oscuro
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginBottom: 20,
    backgroundColor: '#2D3748', // Gris oscuro medio para el header
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2, // Sombra más pronunciada para el tema oscuro
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0', // Texto claro
  },
  openModalButton: {
    backgroundColor: '#9F7AEA', // Morado para el botón principal (abrir modal)
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  openModalButtonPressed: {
    opacity: 0.8,
  },
  openModalIcon: {
    marginRight: 10,
  },
  openModalButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2D3748', // Gris oscuro medio para el modal
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: '90%',
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E2E8F0', // Texto claro
    marginBottom: 25,
    textAlign: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568', // Borde oscuro
    paddingBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4A5568', // Borde oscuro
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#E2E8F0', // Texto claro
    marginBottom: 18,
    backgroundColor: '#1A202C', // Background oscuro para inputs
    width: '100%',
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  addButton: {
    backgroundColor: '#38A169', // Verde para acción positiva (añadir)
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    width: '100%',
    marginTop: 15,
  },
  addButtonPressed: {
    backgroundColor: '#2C7D47', // Verde más oscuro cuando está presionado
    opacity: 0.8,
  },
  addButtonDisabled: {
    backgroundColor: '#4A5568', // Gris oscuro para estado deshabilitado
    shadowColor: '#4A5568',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  listSubtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0', // Texto claro
    marginBottom: 20,
    textAlign: 'center',
    paddingVertical: 10,
  },
  servicioItem: {
    backgroundColor: '#2D3748', // Gris oscuro medio para los ítems
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568', // Separador oscuro
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0', // Texto claro
    flexShrink: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9F7AEA', // Morado para el precio
  },
  itemText: {
    fontSize: 16,
    color: '#A0AEC0', // Texto medio
    marginBottom: 5,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#A0AEC0', // Texto medio
    marginBottom: 15,
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
  editButton: {
    backgroundColor: '#9F7AEA', // Morado para editar
  },
  deleteButton: {
    backgroundColor: '#E53E3E', // Rojo para eliminar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#1A202C', // Fondo principal
  },
  loadingText: {
    marginTop: 15,
    fontSize: 17,
    color: '#A0AEC0', // Texto medio
    fontWeight: '600',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 30,
    backgroundColor: '#2D3748', // Gris oscuro medio
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyListText: {
    fontSize: 18,
    color: '#A0AEC0', // Texto medio
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 25,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peluqueroItem: { // Asegurando que también se actualice este estilo si se usa en otra parte
    backgroundColor: '#2D3748',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    backgroundColor: '#2D3748', // Gris oscuro medio
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
});