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
import { styles } from '../../styles/peluqueros.styles'; // Importa los estilos desde el nuevo archivo
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ¡IMPORTANTE: Importar Ionicons!

type Peluquero = {
    id: string;
    nombre: string;
};

export default function PeluquerosScreen() {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showAddPeluqueroModal, setShowAddPeluqueroModal] = useState(false);
    const [editingPeluquero, setEditingPeluquero] = useState<Peluquero | null>(null);
    const [showEditPeluqueroModal, setShowEditPeluqueroModal] = useState(false);

    // Función para obtener la lista de peluqueros de Firestore
    const fetchPeluqueros = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'Peluqueros'));
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Peluquero[];
            setPeluqueros(docs);
        } catch (error) {
            console.error('Error cargando peluqueros:', error);
            Alert.alert('Error', 'No se pudo cargar la lista de peluqueros.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la creación de un nuevo peluquero
    const handleCrearPeluquero = async () => {
        const trimmed = nombre.trim();

        if (!trimmed) {
            Alert.alert('Campo vacío', 'Introduce el nombre del peluquero.');
            return;
        }

        setSubmitting(true);

        try {
            const q = query(collection(db, 'Peluqueros'), where('nombre', '==', trimmed));
            const existing = await getDocs(q);

            if (!existing.empty) {
                Alert.alert('Duplicado', 'Ya existe un peluquero con ese nombre.');
                return;
            }

            await addDoc(collection(db, 'Peluqueros'), {
                nombre: trimmed,
            });

            Alert.alert('Éxito', 'Peluquero creado correctamente.');
            setNombre('');
            setShowAddPeluqueroModal(false);
            fetchPeluqueros();
        } catch (error) {
            console.error('Error al crear peluquero:', error);
            Alert.alert('Error', 'No se pudo crear el peluquero.');
        } finally {
            setSubmitting(false);
        }
    };

    // Función para iniciar la edición de un peluquero
    const handleEditPeluquero = (peluquero: Peluquero) => {
        setEditingPeluquero(peluquero);
        setNombre(peluquero.nombre); // Precargar el nombre en el input del modal
        setShowEditPeluqueroModal(true);
    };

    // Función para manejar la actualización de un peluquero
    const handleUpdatePeluquero = async () => {
        if (!editingPeluquero) return;

        const trimmed = nombre.trim();

        if (!trimmed) {
            Alert.alert('Campo vacío', 'Introduce el nombre del peluquero.');
            return;
        }

        setSubmitting(true);

        try {
            // Comprobamos si el nombre ya existe en otro peluquero (excluyendo el que estamos editando)
            const q = query(collection(db, 'Peluqueros'), where('nombre', '==', trimmed));
            const existing = await getDocs(q);

            if (!existing.empty && existing.docs[0].id !== editingPeluquero.id) {
                Alert.alert('Duplicado', 'Ya existe otro peluquero con ese nombre.');
                return;
            }

            const peluqueroRef = doc(db, 'Peluqueros', editingPeluquero.id);
            await updateDoc(peluqueroRef, {
                nombre: trimmed,
            });

            Alert.alert('Éxito', 'Peluquero actualizado correctamente.');
            setEditingPeluquero(null);
            setNombre('');
            setShowEditPeluqueroModal(false);
            fetchPeluqueros();
        } catch (error) {
            console.error('Error al actualizar peluquero:', error);
            Alert.alert('Error', 'No se pudo actualizar el peluquero.');
        } finally {
            setSubmitting(false);
        }
    };

    // Función para manejar la eliminación de un peluquero
    const handleDeletePeluquero = (peluqueroId: string) => {
        Alert.alert(
            'Confirmar Eliminación',
            '¿Estás seguro de que quieres eliminar este peluquero? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'Peluqueros', peluqueroId));
                            Alert.alert('Éxito', 'Peluquero eliminado correctamente.');
                            fetchPeluqueros(); // Recargar la lista
                        } catch (error) {
                            console.error('Error al eliminar peluquero:', error);
                            Alert.alert('Error', 'No se pudo eliminar el peluquero.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    // Carga los peluqueros al montar el componente
    useEffect(() => {
        fetchPeluqueros();
    }, []);

    // Componente para renderizar cada peluquero en la lista
    const renderPeluqueroItem = ({ item }: { item: Peluquero }) => (
        <View style={styles.peluqueroItem}>
            <Text style={styles.itemText}>{item.nombre}</Text>
            <View style={styles.itemActions}>
                <Pressable
                    style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.actionButtonPressed]}
                    onPress={() => handleEditPeluquero(item)}
                >
                    {/* Reemplazado IconSymbol por Ionicons */}
                    <Ionicons name="pencil" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.actionButtonPressed]}
                    onPress={() => handleDeletePeluquero(item.id)}
                >
                    {/* Reemplazado IconSymbol por Ionicons */}
                    <Ionicons name="trash" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Eliminar</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Encabezado de la Pantalla */}
                <View style={styles.header}>
                    {/* Botón para ir hacia atrás */}
                    
                    {/* Reemplazado IconSymbol por Ionicons para el icono del título (ajustado icono a uno similar en Ionicons) */}
                    <Ionicons name="cut" size={30} color="#333" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Gestión de Peluqueros</Text>
                </View>

                {/* Botón para abrir el modal de añadir peluquero */}
                <Pressable style={styles.openModalButton} onPress={() => {
                    setEditingPeluquero(null); // Asegurarse de que no estamos editando al abrir para añadir
                    setNombre(''); // Limpiar el campo de nombre
                    setShowAddPeluqueroModal(true);
                }}>
                    {/* Reemplazado IconSymbol por Ionicons */}
                    <Ionicons name="add-circle" size={20} color="#fff" style={styles.openModalIcon} />
                    <Text style={styles.openModalButtonText}>Añadir Nuevo Peluquero</Text>
                </Pressable>

                {/* Modal para añadir nuevo peluquero */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAddPeluqueroModal}
                    onRequestClose={() => {
                        setShowAddPeluqueroModal(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setShowAddPeluqueroModal(false)}
                            >
                                {/* Reemplazado IconSymbol por Ionicons */}
                                <Ionicons name="close-circle" size={24} color="#666" />
                            </Pressable>

                            <Text style={styles.modalTitle}>Añadir Nuevo Peluquero</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del peluquero"
                                placeholderTextColor="#888"
                                value={nombre}
                                onChangeText={setNombre}
                                editable={!submitting}
                            />

                            <Pressable
                                style={({ pressed }) => [
                                    styles.addButton,
                                    pressed && styles.addButtonPressed,
                                    submitting && styles.addButtonDisabled,
                                ]}
                                onPress={handleCrearPeluquero}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.addButtonText}>Agregar Peluquero</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Modal para editar peluquero */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showEditPeluqueroModal}
                    onRequestClose={() => {
                        setShowEditPeluqueroModal(false);
                        setEditingPeluquero(null); // Limpiar el peluquero en edición
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => {
                                    setShowEditPeluqueroModal(false);
                                    setEditingPeluquero(null);
                                }}
                            >
                                {/* Reemplazado IconSymbol por Ionicons */}
                                <Ionicons name="close-circle" size={24} color="#666" />
                            </Pressable>

                            <Text style={styles.modalTitle}>Editar Peluquero</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del peluquero"
                                placeholderTextColor="#888"
                                value={nombre}
                                onChangeText={setNombre}
                                editable={!submitting}
                            />

                            <Pressable
                                style={({ pressed }) => [
                                    styles.addButton,
                                    pressed && styles.addButtonPressed,
                                    submitting && styles.addButtonDisabled,
                                ]}
                                onPress={handleUpdatePeluquero}
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

                {/* Lista de peluqueros */}
                <Text style={styles.listSubtitle}>Peluqueros Registrados</Text>

                <Pressable onPress={() => router.back()} style={styles.backButton}>
                        {/* Reemplazado IconSymbol por Ionicons */}
                        <Ionicons name="arrow-back-circle" size={32} color="#555" />
                    </Pressable>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Cargando peluqueros...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={peluqueros}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPeluqueroItem}
                        refreshing={loading}
                        onRefresh={fetchPeluqueros}
                        ListEmptyComponent={
                            <View style={styles.emptyListContainer}>
                                {/* Reemplazado IconSymbol por Ionicons */}
                                <Ionicons name="person-circle-outline" size={50} color="#ccc" />
                                <Text style={styles.emptyListText}>No hay peluqueros registrados.</Text>
                            </View>
                        }
                        contentContainerStyle={peluqueros.length === 0 && styles.flatListEmpty}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}