import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../lib/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { styles } from '../../styles/servicios.styles'; // Importa los estilos desde el nuevo archivo

type Servicio = {
  id: string;
  nombre: string;
  referencia: string;
  descripcion: string;
  precio: number;
  duracion: string; // AÑADIDO: Propiedad para la duración del servicio
};

const DURACION_OPCIONES = ['30 mins', '1 hora', '1 hora 30 mins', '2 horas']; // Opciones de duración

export default function ServiciosScreen() {
  const [nombre, setNombre] = useState('');
  const [referencia, setReferencia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState(DURACION_OPCIONES[0]); // AÑADIDO: Estado para la duración, con valor inicial
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Servicios'));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        precio: parseFloat(parseFloat(doc.data().precio).toFixed(2)),
        duracion: doc.data().duracion || DURACION_OPCIONES[0], // AÑADIDO: Cargar duración, con un fallback
      })) as Servicio[];
      setServicios(docs);
    } catch (error) {
      console.error('Error cargando servicios:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de servicios.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearServicio = async () => {
    const nombreTrim = nombre.trim();
    const refTrim = referencia.trim();
    const descTrim = descripcion.trim();
    const precioTrim = precio.trim();

    if (!nombreTrim || !refTrim || !descTrim || !precioTrim) {
      Alert.alert('Campos vacíos', 'Rellena todos los campos.');
      return;
    }

    const precioNumber = parseFloat(precioTrim);
    if (isNaN(precioNumber) || precioNumber < 0) {
      Alert.alert('Precio inválido', 'Introduce un precio válido (número mayor o igual a 0).');
      return;
    }

    setSubmitting(true);

    try {
      const q = query(collection(db, 'Servicios'), where('referencia', '==', refTrim));
      const existing = await getDocs(q);

      if (!existing.empty) {
        Alert.alert('Duplicado', 'Ya existe un servicio con esa referencia.');
        return;
      }

      await addDoc(collection(db, 'Servicios'), {
        nombre: nombreTrim,
        referencia: refTrim,
        descripcion: descTrim,
        precio: Number(precioNumber.toFixed(2)),
        duracion: duracion, // AÑADIDO: Guardar la duración
      });

      Alert.alert('Éxito', 'Servicio creado correctamente.');
      setNombre('');
      setReferencia('');
      setDescripcion('');
      setPrecio('');
      setDuracion(DURACION_OPCIONES[0]); // Resetear duración
      setShowAddServiceModal(false);
      fetchServicios();
    } catch (error) {
      console.error('Error al crear servicio:', error);
      Alert.alert('Error', 'No se pudo crear el servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditService = (service: Servicio) => {
    setEditingService(service);
    setNombre(service.nombre);
    setReferencia(service.referencia);
    setDescripcion(service.descripcion);
    setPrecio(service.precio.toString());
    setDuracion(service.duracion || DURACION_OPCIONES[0]); // AÑADIDO: Cargar la duración para edición
    setShowEditServiceModal(true);
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    const nombreTrim = nombre.trim();
    const refTrim = referencia.trim();
    const descTrim = descripcion.trim();
    const precioTrim = precio.trim();

    if (!nombreTrim || !refTrim || !descTrim || !precioTrim) {
      Alert.alert('Campos vacíos', 'Rellena todos los campos.');
      return;
    }

    const precioNumber = parseFloat(precioTrim);
    if (isNaN(precioNumber) || precioNumber < 0) {
      Alert.alert('Precio inválido', 'Introduce un precio válido (número mayor o igual a 0).');
      return;
    }

    setSubmitting(true);

    try {
      const q = query(collection(db, 'Servicios'), where('referencia', '==', refTrim));
      const existing = await getDocs(q);

      if (!existing.empty && existing.docs[0].id !== editingService.id) {
        Alert.alert('Duplicado', 'Ya existe otro servicio con esa referencia.');
        return;
      }

      const serviceRef = doc(db, 'Servicios', editingService.id);
      await updateDoc(serviceRef, {
        nombre: nombreTrim,
        referencia: refTrim,
        descripcion: descTrim,
        precio: Number(precioNumber.toFixed(2)),
        duracion: duracion, // AÑADIDO: Actualizar la duración
      });

      Alert.alert('Éxito', 'Servicio actualizado correctamente.');
      setEditingService(null);
      setNombre('');
      setReferencia('');
      setDescripcion('');
      setPrecio('');
      setDuracion(DURACION_OPCIONES[0]); // Resetear duración
      setShowEditServiceModal(false);
      fetchServicios();
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      Alert.alert('Error', 'No se pudo actualizar el servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Servicios', serviceId));
              Alert.alert('Éxito', 'Servicio eliminado correctamente.');
              fetchServicios(); // Recargar la lista
            } catch (error) {
              console.error('Error al eliminar servicio:', error);
              Alert.alert('Error', 'No se pudo eliminar el servicio.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const renderServicioItem = ({ item }: { item: Servicio }) => (
    <View style={styles.serviceItem}> 
      <View style={styles.serviceInfo}> 
        <Text style={styles.serviceName}>{item.nombre}</Text> 
        <Text style={styles.serviceDetails}>Referencia: {item.referencia}</Text> 
        <Text style={styles.serviceDetails}>Descripción: {item.descripcion}</Text>
        <Text style={styles.serviceDetails}>Precio: €{item.precio.toFixed(2)}</Text>
        <Text style={styles.serviceDetails}>Duración: {item.duracion}</Text> 
      </View>
      <View style={styles.serviceActions}> 
        <Pressable
          style={[styles.actionButton, styles.editButton]} // Usados actionButton, editButton
          onPress={() => handleEditService(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" /> 
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]} // Usados actionButton, deleteButton
          onPress={() => handleDeleteService(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" /> 
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="pricetag" size={30} color="#333" style={styles.headerIcon} /> 
          <Text style={styles.title}>Gestión de Servicios</Text> 
        </View>

        <Pressable
          style={styles.addButton} // Usado addButton
          onPress={() => {
            setEditingService(null); // Asegurarse de que no estamos editando al abrir para añadir
            setNombre('');
            setReferencia('');
            setDescripcion('');
            setPrecio('');
            setDuracion(DURACION_OPCIONES[0]); // Resetear a la primera opción de duración
            setShowAddServiceModal(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Añadir Nuevo Servicio</Text> 
        </Pressable>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddServiceModal}
          onRequestClose={() => {
            setShowAddServiceModal(false);
          }}
        >
          <View style={styles.modalBackground}> 
            <View style={styles.modalContainer}> 
              <Pressable
                style={styles.closeButton} // Se usa closeButton
                onPress={() => setShowAddServiceModal(false)}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </Pressable>

              <Text style={styles.modalTitle}>Añadir Nuevo Servicio</Text> 
              <TextInput
                style={styles.input} // Usado input
                placeholder="Nombre del servicio"
                placeholderTextColor="#888"
                value={nombre}
                onChangeText={setNombre}
                editable={!submitting}
              />

              <TextInput
                style={styles.input}
                placeholder="Referencia (ej. CORTE_CABALLERO)"
                placeholderTextColor="#888"
                value={referencia}
                onChangeText={setReferencia}
                editable={!submitting}
                autoCapitalize="characters"
              />

              <TextInput
                style={styles.input}
                placeholder="Descripción del servicio"
                placeholderTextColor="#888"
                value={descripcion}
                onChangeText={setDescripcion}
                editable={!submitting}
                multiline
                numberOfLines={3}
              />

              <TextInput
                style={styles.input}
                placeholder="Precio (€)"
                placeholderTextColor="#888"
                value={precio}
                onChangeText={(text) => setPrecio(text.replace(',', '.'))}
                editable={!submitting}
                keyboardType="decimal-pad"
              />

              <Text style={styles.modalLabel}>Duración:</Text>
              <View style={styles.durationOptionsContainer}>
                {DURACION_OPCIONES.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.durationOptionButton,
                      duracion === option && styles.durationOptionButtonSelected,
                    ]}
                    onPress={() => setDuracion(option)}
                  >
                    <Text style={duracion === option ? styles.durationOptionTextSelected : styles.durationOptionText}>
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[
                  styles.addButton,
                  submitting && styles.addButtonDisabled,
                ]}
                onPress={handleCrearServicio}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Agregar Servicio</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showEditServiceModal}
          onRequestClose={() => {
            setShowEditServiceModal(false);
            setEditingService(null);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowEditServiceModal(false);
                  setEditingService(null);
                }}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </Pressable>

              <Text style={styles.modalTitle}>Editar Servicio</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del servicio"
                placeholderTextColor="#888"
                value={nombre}
                onChangeText={setNombre}
                editable={!submitting}
              />

              <TextInput
                style={styles.input}
                placeholder="Referencia (ej. CORTE_CABALLERO)"
                placeholderTextColor="#888"
                value={referencia}
                onChangeText={setReferencia}
                editable={!submitting}
                autoCapitalize="characters"
              />

              <TextInput
                style={styles.input}
                placeholder="Descripción del servicio"
                placeholderTextColor="#888"
                value={descripcion}
                onChangeText={setDescripcion}
                editable={!submitting}
                multiline
                numberOfLines={3}
              />

              <TextInput
                style={styles.input}
                placeholder="Precio (€)"
                placeholderTextColor="#888"
                value={precio}
                onChangeText={(text) => setPrecio(text.replace(',', '.'))}
                editable={!submitting}
                keyboardType="decimal-pad"
              />

              <Text style={styles.modalLabel}>Duración:</Text>
              <View style={styles.durationOptionsContainer}>
                {DURACION_OPCIONES.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.durationOptionButton,
                      duracion === option && styles.durationOptionButtonSelected,
                    ]}
                    onPress={() => setDuracion(option)}
                  >
                    <Text style={duracion === option ? styles.durationOptionTextSelected : styles.durationOptionText}>
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[
                  styles.addButton,
                  submitting && styles.addButtonDisabled,
                ]}
                onPress={handleUpdateService}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Guardar Cambios</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>

        <Text style={styles.listSubtitle}>Servicios Registrados</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando servicios...</Text>
          </View>
        ) : (
          <FlatList
            data={servicios}
            keyExtractor={(item) => item.id}
            renderItem={renderServicioItem}
            refreshing={loading}
            onRefresh={fetchServicios}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Ionicons name="pricetag-outline" size={50} color="#ccc" />
                <Text style={styles.emptyListText}>No hay servicios registrados aún.</Text>
              </View>
            }
            contentContainerStyle={servicios.length === 0 && styles.flatListEmpty}
          />
        )}
      </View>
    </SafeAreaView>
  );
}