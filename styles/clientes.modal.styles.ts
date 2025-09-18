import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  // --- CONTENEDOR DE BONOS ---
  bonoContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#e8f6f3",
    borderWidth: 1,
    borderColor: "#c0e6e6",
    alignItems: "center",
  },
  bonoInfo: {
    width: "100%",
    alignItems: "center",
  },
  bonoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  bonoTipo: {
    fontWeight: "bold",
    color: "#00796b",
  },
  bonoRestantes: {
    fontWeight: "bold",
    color: "#d32f2f",
    fontSize: 18,
  },
  noBonoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  bonoButton: {
    marginTop: 10,
    backgroundColor: "#00897b",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  bonoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bonoOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  bonoOptionButton: {
    backgroundColor: "#005a4f",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  bonoOptionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  // --- CONTENEDOR DE RESERVAS MEJORADO ---
  reservasSection: {
    width: "100%",
    marginTop: 15,
    // Permite que la sección de reservas ocupe todo el espacio vertical restante
    flex: 1,
  },
  reservasHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  reservasList: {
    width: "100%",
  },
  reservaItem: {
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  reservaText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  reservaLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  reservaEstado: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  estadoPendiente: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  estadoCompletada: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  estadoCancelada: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  noReservasText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
