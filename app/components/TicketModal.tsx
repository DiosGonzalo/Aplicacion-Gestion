import dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

dayjs.locale('es');

// 👉 Definición de props con TypeScript
type TicketModalProps = {
  reserva: {
    id: string;
    fecha: string | Date;
    hora: string;
    estado: string;
  };
  peluqueroNombre: string;
  servicioNombre: string;
  servicioPrecio: number;
  onClose: () => void;
  visible: boolean; // 👈 añadida

};

// Componente del modal de ticket
function TicketModal({
  reserva,
  peluqueroNombre,
  servicioNombre,
  servicioPrecio,
  onClose,
}: TicketModalProps) {
  const IVA_RATE = 0.21;

  const subtotal = servicioPrecio;
  const ivaAmount = subtotal * IVA_RATE;
  const totalPrice = subtotal + ivaAmount;

  const handlePrint = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ticket de Reserva</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 13px;
              color: #000;
              margin: 0;
              padding: 20px;
            }
            .ticket-container {
              width: 300px;
              margin: auto;
              padding: 10px;
            }
            .header, .footer {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .header p {
              margin: 4px 0;
              font-size: 11px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .details-table {
              width: 100%;
              margin-bottom: 20px;
              border-collapse: collapse;
            }
            .details-table td {
              padding: 5px 0;
            }
            .details-table .label {
              text-align: left;
              font-weight: bold;
            }
            .details-table .value {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
              border-top: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="header">
              <h1>Miguel Delgado</h1>
              <p>Dirección: Calle Dr Fleming, 7,  Sevilla</p>
              <p>Teléfono: 662-160-463</p>
            </div>
            <div class="divider"></div>
            <table class="details-table">
              <tr>
                <td class="label">ID de Reserva:</td>
                <td class="value">${reserva.id.slice(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td class="label">Peluquero:</td>
                <td class="value">${peluqueroNombre}</td>
              </tr>
              <tr>
                <td class="label">Servicio:</td>
                <td class="value">${servicioNombre}</td>
              </tr>
              <tr>
                <td class="label">Fecha:</td>
                <td class="value">${dayjs(reserva.fecha).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td class="label">Hora:</td>
                <td class="value">${reserva.hora}</td>
              </tr>
              
              <tr>
                <td colspan="2" class="divider"></td>
              </tr>
              <tr>
                <td class="label">Subtotal:</td>
                <td class="value">€${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">IVA (${(IVA_RATE * 100).toFixed(0)}%):</td>
                <td class="value">€${ivaAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td class="label">Total:</td>
                <td class="value">€${totalPrice.toFixed(2)}</td>
              </tr>
            </table>
            <div class="divider"></div>
            <div class="footer">
              <p>¡Gracias por tu visita!</p>
              <p>Esperamos verte pronto.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error al generar o compartir el PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Ticket de Reserva</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID de Reserva:</Text>
              <Text style={styles.detailValue}>{reserva.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Peluquero:</Text>
              <Text style={styles.detailValue}>{peluqueroNombre}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Servicio:</Text>
              <Text style={styles.detailValue}>{servicioNombre}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha:</Text>
              <Text style={styles.detailValue}>{dayjs(reserva.fecha).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hora:</Text>
              <Text style={styles.detailValue}>{reserva.hora}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={styles.detailValue}>{reserva.estado}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subtotal:</Text>
              <Text style={styles.detailValue}>€{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>IVA ({(IVA_RATE * 100).toFixed(0)}%):</Text>
              <Text style={styles.detailValue}>€{ivaAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>€{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
          <Pressable style={[styles.button, styles.buttonPrint]} onPress={handlePrint}>
            <Text style={styles.buttonText}>Generar y Compartir PDF</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
    paddingBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
  },
  divider: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  buttonPrint: {
    backgroundColor: '#007AFF',
  },
  buttonClose: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TicketModal;
