import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router'; // AÑADIDO: Importación para navegación
import * as Sharing from 'expo-sharing';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../lib/firebaseConfig';
import { reportsStyles as styles } from '../../styles/informes.styles';

// Define types (you might already have these, but including for clarity)
type Peluquero = {
  id: string;
  nombre: string;
};

type Servicio = {
  id: string;
  nombre: string;
  precio: number;
};

type Reserva = {
  id: string;
  clienteNombre: string;
  peluqueroId: string;
  fecha: string;
  hora: string;
  servicioId: string;
  estado?: 'pendiente' | 'completada' | 'cancelada';
  metodoPago?: 'tarjeta' | 'efectivo';
  createdAt?: string;
};

// Define types for report data
type ShopReportData = {
  totalRevenue: number;
  cardRevenue: number;
  cashRevenue: number;
  completedAppointments: number;
  canceledAppointments: number;
  pendingAppointments: number;
  servicePopularity: { name: string; count: number; revenue: number }[];
};

type HairdresserReportData = {
  id: string;
  nombre: string;
  revenue: number;
  cardRevenue: number;
  cashRevenue: number;
  completedAppointments: number;
  avgPricePerAppointment: number;
  // Add other metrics as needed
};

export default function ReportsScreen() { // MODIFICADO: No es necesario pasar `navigation`
  const router = useRouter(); // AÑADIDO: Inicializar router
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);

  // Filter states
  const [startDate, setStartDate] = useState(dayjs().startOf('month').toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf('month').toDate());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [selectedPeluqueroId, setSelectedPeluqueroId] = useState<string | 'all'>('all'); // 'all' for all hairdressers
  const [reportPeriod, setReportPeriod] = useState<'annual' | 'monthly' | 'weekly' | 'custom'>('monthly');

  // Report data states
  const [shopReport, setShopReport] = useState<ShopReportData | null>(null);
  const [hairdresserReports, setHairdresserReports] = useState<HairdresserReportData[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Reserva[]>([]); // For the detailed list
  // NEW: State for grouped appointments
  const [groupedAppointments, setGroupedAppointments] = useState<{[key: string]: Reserva[]}>({});


  // Fetch Peluqueros and Servicios on component mount
  useEffect(() => {
    const fetchPeluquerosAndServicios = async () => {
      try {
        const peluquerosSnapshot = await getDocs(collection(db, 'Peluqueros'));
        const pelus: Peluquero[] = peluquerosSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre || 'Sin nombre',
        }));
        setPeluqueros(pelus);

        const serviciosSnapshot = await getDocs(collection(db, 'Servicios'));
        const servs: Servicio[] = serviciosSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre || 'Sin nombre',
          precio: doc.data().precio || 0,
        }));
        setServicios(servs);
      } catch (err: any) {
        setError(`Error al cargar datos iniciales: ${err.message}`);
        console.error('Error fetching initial data:', err);
      }
    };
    fetchPeluquerosAndServicios();
  }, []);

  // Function to calculate and fetch reports
  const generateReports = async () => {
    setLoading(true);
    setError(null);
    setShopReport(null);
    setHairdresserReports([]);
    setFilteredAppointments([]);
    setGroupedAppointments({}); // Clear grouped appointments

    try {
      const startOfDay = dayjs(startDate).startOf('day').format('YYYY-MM-DD');
      const endOfDay = dayjs(endDate).endOf('day').format('YYYY-MM-DD');

      let q = query(
        collection(db, 'Reservas'),
        where('fecha', '>=', startOfDay),
        where('fecha', '<=', endOfDay),
      );

      if (selectedPeluqueroId !== 'all') {
        q = query(q, where('peluqueroId', '==', selectedPeluqueroId));
      }

      const querySnapshot = await getDocs(q);
      const fetchedReservas: Reserva[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        clienteNombre: doc.data().nombreReserva || doc.data().clienteNombre || 'Sin nombre',
        peluqueroId: doc.data().peluqueroId || '',
        fecha: doc.data().fecha || '',
        hora: doc.data().hora || '',
        servicioId: doc.data().servicioId || '',
        estado: doc.data().estado || 'pendiente',
        metodoPago: doc.data().metodoPago || undefined, // NUEVO: Leer el método de pago
      }));

      // --- Calculate Shop Report ---
      let totalRevenue = 0;
      let cardRevenue = 0;
      let cashRevenue = 0;
      let completedAppointments = 0;
      let canceledAppointments = 0;
      let pendingAppointments = 0;
      const serviceCounts: { [key: string]: { count: number; revenue: number } } = {};

      fetchedReservas.forEach((reserva) => {
        if (reserva.estado === 'completada') {
          completedAppointments++;
          const servicio = servicios.find(s => s.id === reserva.servicioId);
          if (servicio) {
            totalRevenue += servicio.precio;
            // NUEVO: Sumar al tipo de pago correspondiente
            if (reserva.metodoPago === 'tarjeta') {
              cardRevenue += servicio.precio;
            } else if (reserva.metodoPago === 'efectivo') {
              cashRevenue += servicio.precio;
            }

            serviceCounts[servicio.id] = serviceCounts[servicio.id] || { count: 0, revenue: 0 };
            serviceCounts[servicio.id].count++;
            serviceCounts[servicio.id].revenue += servicio.precio;
          }
        } else if (reserva.estado === 'cancelada') {
          canceledAppointments++;
        } else if (reserva.estado === 'pendiente') {
          pendingAppointments++;
        }
      });

      const servicePopularity = Object.keys(serviceCounts)
        .map(serviceId => {
          const service = servicios.find(s => s.id === serviceId);
          return {
            name: service?.nombre || 'Desconocido',
            count: serviceCounts[serviceId].count,
            revenue: serviceCounts[serviceId].revenue,
          };
        })
        .sort((a, b) => b.count - a.count); // Sort by most popular

      setShopReport({
        totalRevenue,
        cardRevenue,
        cashRevenue,
        completedAppointments,
        canceledAppointments,
        pendingAppointments,
        servicePopularity,
      });

      // --- Calculate Hairdresser Reports ---
      const hairdresserStats: { [key: string]: HairdresserReportData } = {};
      peluqueros.forEach(p => {
        hairdresserStats[p.id] = {
          id: p.id,
          nombre: p.nombre,
          revenue: 0,
          cardRevenue: 0,
          cashRevenue: 0,
          completedAppointments: 0,
          avgPricePerAppointment: 0,
        };
      });

      fetchedReservas.forEach(reserva => {
        if (reserva.estado === 'completada' && hairdresserStats[reserva.peluqueroId]) {
          const servicio = servicios.find(s => s.id === reserva.servicioId);
          if (servicio) {
            hairdresserStats[reserva.peluqueroId].revenue += servicio.precio;
            hairdresserStats[reserva.peluqueroId].completedAppointments++;
            // NUEVO: Sumar al tipo de pago del peluquero
            if (reserva.metodoPago === 'tarjeta') {
              hairdresserStats[reserva.peluqueroId].cardRevenue += servicio.precio;
            } else if (reserva.metodoPago === 'efectivo') {
              hairdresserStats[reserva.peluqueroId].cashRevenue += servicio.precio;
            }
          }
        }
      });

      const processedHairdresserReports: HairdresserReportData[] = Object.values(hairdresserStats).map(
        (stats) => ({
          ...stats,
          avgPricePerAppointment: stats.completedAppointments > 0 ? stats.revenue / stats.completedAppointments : 0,
        })
      );
      setHairdresserReports(processedHairdresserReports);

      // Sort and group appointments for detailed list
      const sortedAppointments = fetchedReservas.sort((a, b) => {
        const dateTimeA = dayjs(`${a.fecha}T${a.hora}`);
        const dateTimeB = dayjs(`${b.fecha}T${b.hora}`);
        return dateTimeA.diff(dateTimeB);
      });
      setFilteredAppointments(sortedAppointments);

      const grouped: {[key: string]: Reserva[]} = {};
      sortedAppointments.forEach(reserva => {
        const dateKey = dayjs(reserva.fecha).format('YYYY-MM-DD'); // Group by day
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(reserva);
      });
      setGroupedAppointments(grouped);


    } catch (err: any) {
      setError(`Error al generar informes: ${err.message}`);
      console.error('Error generating reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to re-generate reports when filters change
  useEffect(() => {
    generateReports();
  }, [startDate, endDate, selectedPeluqueroId, servicios, peluqueros]);

  const handlePeriodChange = (period: 'annual' | 'monthly' | 'weekly' | 'custom') => {
    setReportPeriod(period);
    const now = dayjs();
    if (period === 'annual') {
      setStartDate(now.startOf('year').toDate());
      setEndDate(now.endOf('year').toDate());
    } else if (period === 'monthly') {
      setStartDate(now.startOf('month').toDate());
      setEndDate(now.endOf('month').toDate());
    } else if (period === 'weekly') {
      setStartDate(now.startOf('week').toDate());
      setEndDate(now.endOf('week').toDate());
    }
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowDatePickerStart(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowDatePickerEnd(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const generateReportHtml = () => {
    if (!shopReport) return '';

    const formatDate = (date: Date) => dayjs(date).locale('es').format('D [de] MMMM [de] YYYY');
    const periodText = `Período: ${formatDate(startDate)} - ${formatDate(endDate)}`;

    const companyData = {
      nombreComercial: "Miguel Delgado",
      razonSocial: "Miguel Delgado S.L.",
      cifNif: "B12345678",
      direccionFiscal: "Calle Dr. Fleming, 7, 41907 Valencina de la Concepción, Sevilla",
      telefono: "+34 662 16 04 63",
      email: "contacto@tupeluqueriaestelar.com",
      registro: "Reg. Mercantil M-123456",
    };

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Informe de Ventas y Citas</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f9;
            color: #333;
            line-height: 1.6;
            font-size: 14px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          header h1 {
            font-size: 28px;
            color: #2c3e50;
            margin: 0 0 5px 0;
          }
          header p {
            margin: 0;
            color: #7f8c8d;
            font-size: 14px;
          }
          .company-info {
            margin-top: 15px;
            padding: 10px 0;
            border-top: 1px dashed #e0e0e0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
          }
          .company-info span {
            font-size: 12px;
            color: #95a5a6;
            white-space: nowrap;
          }
          h2 {
            font-size: 20px;
            color: #2c3e50;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          h3 {
            font-size: 16px;
            color: #34495e;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .kpi-card {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
          }
          .kpi-card .value {
            font-size: 28px;
            font-weight: bold;
            margin-top: 5px;
          }
          .kpi-card .label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
          }
          .kpi-revenue .value { color: #2ecc71; }
          .kpi-card .value-total { color: #3498db; }
          .kpi-card .value-card { color: #9b59b6; }
          .kpi-card .value-cash { color: #1abc9c; }
          .kpi-card .value-completed { color: #27ae60; }
          .kpi-card .value-pending { color: #f1c40f; }
          .kpi-card .value-canceled { color: #e74c3c; }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background-color: #fff;
          }
          th, td {
            padding: 12px 10px;
            text-align: left;
            border: 1px solid #e0e0e0;
          }
          th {
            background-color: #ecf0f1;
            font-weight: bold;
            color: #34495e;
            font-size: 12px;
            text-transform: uppercase;
          }
          tr:nth-child(even) {
            background-color: #fcfcfc;
          }
          td {
            font-size: 12px;
            color: #555;
          }
          .daily-header {
            background-color: #34495e;
            color: #fff;
            padding: 10px 15px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 20px;
            border-radius: 4px;
          }
          .list-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e0e0e0;
          }
          .list-item:last-child { border-bottom: none; }
          .list-item .label { color: #555; }
          .list-item span { color: #333; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }

          .status-completada { color: #27ae60; font-weight: bold; }
          .status-pendiente { color: #f1c40f; font-weight: bold; }
          .status-cancelada { color: #e74c3c; font-weight: bold; }
          .payment-method { text-transform: capitalize; }
          .payment-tarjeta { color: #9b59b6; font-weight: bold; }
          .payment-efectivo { color: #1abc9c; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Informe de Ventas y Rendimiento</h1>
            <p>${periodText}</p>
            <div class="company-info">
              <span><strong>Empresa:</strong> ${companyData.nombreComercial}</span>
              <span><strong>CIF:</strong> ${companyData.cifNif}</span>
              <span><strong>Teléfono:</strong> ${companyData.telefono}</span>
              <span><strong>Email:</strong> ${companyData.email}</span>
            </div>
          </header>

          <h2>Resumen de Ingresos</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <p class="label">Ingresos Totales</p>
              <p class="value value-total">€${shopReport.totalRevenue.toFixed(2)}</p>
            </div>
            <div class="kpi-card">
              <p class="label">Ingresos con Tarjeta</p>
              <p class="value value-card">€${shopReport.cardRevenue.toFixed(2)}</p>
            </div>
            <div class="kpi-card">
              <p class="label">Ingresos en Efectivo</p>
              <p class="value value-cash">€${shopReport.cashRevenue.toFixed(2)}</p>
            </div>
          </div>

          <h2>Resumen de Citas</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <p class="label">Citas Completadas</p>
              <p class="value value-completed">${shopReport.completedAppointments}</p>
            </div>
            <div class="kpi-card">
              <p class="label">Citas Pendientes</p>
              <p class="value value-pending">${shopReport.pendingAppointments}</p>
            </div>
            <div class="kpi-card">
              <p class="label">Citas Canceladas</p>
              <p class="value value-canceled">${shopReport.canceledAppointments}</p>
            </div>
          </div>

          ${shopReport.servicePopularity.length > 0 ? `
          <h2>Servicios Más Populares</h2>
          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th class="text-right">Número de Citas</th>
                <th class="text-right">Ingresos Generados</th>
              </tr>
            </thead>
            <tbody>
            ${shopReport.servicePopularity.slice(0, 5).map(service => `
              <tr>
                <td>${service.name}</td>
                <td class="text-right">${service.count}</td>
                <td class="text-right">€${service.revenue.toFixed(2)}</td>
              </tr>
            `).join('')}
            </tbody>
          </table>
          ` : ''}

          ${hairdresserReports.length > 0 && selectedPeluqueroId === 'all' ? `
          <h2>Rendimiento por Peluquero</h2>
          ${hairdresserReports.map(hReport => `
            <h3>${hReport.nombre}</h3>
            <table>
              <tbody>
                <tr>
                  <td>Ingresos Totales:</td>
                  <td class="text-right">€${hReport.revenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Ingresos con Tarjeta:</td>
                  <td class="text-right">€${hReport.cardRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Ingresos en Efectivo:</td>
                  <td class="text-right">€${hReport.cashRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Citas Completadas:</td>
                  <td class="text-right">${hReport.completedAppointments}</td>
                </tr>
                <tr>
                  <td>Precio Promedio/Cita:</td>
                  <td class="text-right">€${hReport.avgPricePerAppointment.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          `).join('')}
          ` : ''}

          ${hairdresserReports.length > 0 && selectedPeluqueroId !== 'all' ? `
          <h2>Rendimiento de ${peluqueros.find(p => p.id === selectedPeluqueroId)?.nombre || 'Peluquero Seleccionado'}</h2>
          ${hairdresserReports.filter(h => h.id === selectedPeluqueroId).map(hReport => `
            <table>
              <tbody>
                <tr>
                  <td>Ingresos Totales:</td>
                  <td class="text-right">€${hReport.revenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Ingresos con Tarjeta:</td>
                  <td class="text-right">€${hReport.cardRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Ingresos en Efectivo:</td>
                  <td class="text-right">€${hReport.cashRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Citas Completadas:</td>
                  <td class="text-right">${hReport.completedAppointments}</td>
                </tr>
                <tr>
                  <td>Precio Promedio/Cita:</td>
                  <td class="text-right">€${hReport.avgPricePerAppointment.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          `).join('')}
          ` : ''}

          ${Object.keys(groupedAppointments).length > 0 ? `
          <h2>Detalle de Citas</h2>
          ${Object.keys(groupedAppointments).sort().map(dateKey => `
            <div class="daily-header">${dayjs(dateKey).locale('es').format('dddd, D [de] MMMM [de] YYYY')}</div>
            <table>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Peluquero</th>
                  <th>Servicio</th>
                  <th class="text-right">Precio</th>
                  <th class="text-center">Método de Pago</th>
                  <th class="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                ${groupedAppointments[dateKey].map(reserva => `
                  <tr>
                    <td>${reserva.hora}</td>
                    <td>${reserva.clienteNombre}</td>
                    <td>${peluqueros.find(p => p.id === reserva.peluqueroId)?.nombre || 'N/A'}</td>
                    <td>${servicios.find(s => s.id === reserva.servicioId)?.nombre || 'N/A'}</td>
                    <td class="text-right">€${(servicios.find(s => s.id === reserva.servicioId)?.precio || 0).toFixed(2)}</td>
                    <td class="payment-method text-center payment-${reserva.metodoPago || 'desconocido'}">${reserva.metodoPago || 'N/A'}</td>
                    <td class="status-${reserva.estado} text-center">${reserva.estado}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `).join('')}
          ` : ''}
          
          ${!shopReport && !hairdresserReports.length && !filteredAppointments.length ? `
          <div class="section" style="text-align: center; padding: 40px;">
              <p style="color: #FC8181; font-size: 20px; font-weight: bold;">No hay datos de informes para el período seleccionado.</p>
          </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
    return htmlContent;
  };

  // --- Función para exportar el PDF ---
  const handleExportPdf = async () => {
    // Generate the HTML content directly before trying to export
    const htmlContent = generateReportHtml();

    // Check if the generated HTML is empty or if there is no report data
    if (!htmlContent.trim() || (!shopReport && !hairdresserReports.length && !filteredAppointments.length)) {
        Alert.alert('No hay datos', 'No hay datos en el informe para exportar a PDF.');
        return;
    }

    setLoading(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (Platform.OS === 'ios' || (Platform.OS === 'android' && await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      } else {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
      }
    } catch (err) {
      Alert.alert('Error al exportar PDF', `Ocurrió un error: ${(err as Error).message}`);
      console.error('Error exporting PDF:', err);
    } finally {
      setLoading(false);
    }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        onPress={() => router.back()} // MODIFICADO: Uso de router.back()
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS status bar
          left: 20,
          zIndex: 1, // Ensure the button is on top
        }}
      >
        <Ionicons name="chevron-back-outline" size={28} color="#9F7AEA" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.agendaScrollViewContent}>
        <Text style={styles.compactModalTitle}>Informes de la Tienda</Text>

        {/* NEW: Tarjeta de Resumen / Ingresos Totales del Período */}
        {shopReport && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ingresos Totales del Período</Text>
            <Text style={styles.summaryValue}>€{shopReport.totalRevenue.toFixed(2)}</Text>
            <Pressable
              style={styles.seeMoreButton}
              onPress={() => Alert.alert('Funcionalidad Pendiente', 'Este botón aún no tiene una acción asignada.')}
            >
              <Text style={styles.seeMoreButtonText}>Ver Más</Text>
              <Ionicons name="chevron-forward-outline" size={16} color={styles.seeMoreButtonText.color} />
            </Pressable>
          </View>
        )}

        {/* Date and Period Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.compactLabel}>Periodo:</Text>
          <View style={styles.compactOptionButtonsContainer}>
            <Pressable
              style={[styles.compactSelectionButton, reportPeriod === 'weekly' && styles.compactSelectionButtonSelected]}
              onPress={() => handlePeriodChange('weekly')}
            >
              <Text style={reportPeriod === 'weekly' ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>Semanal</Text>
            </Pressable>
            <Pressable
              style={[styles.compactSelectionButton, reportPeriod === 'monthly' && styles.compactSelectionButtonSelected]}
              onPress={() => handlePeriodChange('monthly')}
            >
              <Text style={reportPeriod === 'monthly' ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>Mensual</Text>
            </Pressable>
            <Pressable
              style={[styles.compactSelectionButton, reportPeriod === 'annual' && styles.compactSelectionButtonSelected]}
              onPress={() => handlePeriodChange('annual')}
            >
              <Text style={reportPeriod === 'annual' ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>Anual</Text>
            </Pressable>
            <Pressable
              style={[styles.compactSelectionButton, reportPeriod === 'custom' && styles.compactSelectionButtonSelected]}
              onPress={() => handlePeriodChange('custom')}
            >
              <Text style={reportPeriod === 'custom' ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>Manual</Text>
            </Pressable>
          </View>
        </View>

        {reportPeriod === 'custom' && (
          <View style={styles.filterSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.compactLabel}>Desde:</Text>
                <Pressable onPress={() => setShowDatePickerStart(true)} style={[styles.compactInput, styles.compactDateInput]}>
                  <Text style={{color: styles.compactInput.color}}>{dayjs(startDate).format('DD/MM/YYYY')}</Text>
                   <Ionicons name="calendar-outline" size={18} color={styles.compactLabel.color} />
                </Pressable>
                {showDatePickerStart && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeStartDate}
                  />
                )}
              </View>
              <View style={styles.datePickerContainer}>
                <Text style={styles.compactLabel}>Hasta:</Text>
                <Pressable onPress={() => setShowDatePickerEnd(true)} style={[styles.compactInput, styles.compactDateInput]}>
                  <Text style={{color: styles.compactInput.color}}>{dayjs(endDate).format('DD/MM/YYYY')}</Text>
                   <Ionicons name="calendar-outline" size={18} color={styles.compactLabel.color} />
                </Pressable>
                {showDatePickerEnd && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeEndDate}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Peluquero Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.compactLabel}>Filtrar por Peluquero:</Text>
          <View style={styles.compactOptionButtonsContainer}>
            <Pressable
              onPress={() => setSelectedPeluqueroId('all')}
              style={[
                styles.compactSelectionButton,
                selectedPeluqueroId === 'all' && styles.compactSelectionButtonSelected,
              ]}
            >
              <Text style={selectedPeluqueroId === 'all' ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>Todos</Text>
            </Pressable>
            {peluqueros.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPeluqueroId(p.id)}
                style={[
                  styles.compactSelectionButton,
                  selectedPeluqueroId === p.id && styles.compactSelectionButtonSelected,
                ]}
              >
                <Text style={selectedPeluqueroId === p.id ? styles.compactSelectionButtonTextSelected : styles.compactSelectionButtonText}>
                  {p.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
          {/* Botón de Exportar PDF */}
          <Pressable style={styles.exportPdfButton} onPress={handleExportPdf} disabled={loading}>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text style={styles.exportPdfButtonText}>Exportar PDF</Text>
          </Pressable>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9F7AEA" />
            <Text style={styles.loadingText}>Generando informes...</Text>
          </View>
        ) : (
          <View style={styles.reportsContentContainer}>
            {/* KPI Cards Section - "Total Ingresos" now handled by summaryCard above */}
            {shopReport && (
              <>
                <View style={styles.kpiCardsRow}>
                  <View style={[styles.kpiCard, { flex: 1, backgroundColor: '#4299E120' }]}>
                      <Ionicons name="card-outline" size={24} color="#4299E1" />
                      <Text style={styles.kpiTitle}>Ingresos Tarjeta</Text>
                      <Text style={[styles.kpiValue, { color: '#4299E1' }]}>€{shopReport.cardRevenue.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.kpiCard, { flex: 1, backgroundColor: '#48BB7820', marginLeft: 10 }]}>
                      <Ionicons name="cash-outline" size={24} color="#48BB78" />
                      <Text style={styles.kpiTitle}>Ingresos Efectivo</Text>
                      <Text style={[styles.kpiValue, { color: '#48BB78' }]}>€{shopReport.cashRevenue.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.kpiCardsRow}>
                  <View style={styles.kpiCard}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#3182CE" />
                    <Text style={styles.kpiTitle}>Citas Completadas</Text>
                    <Text style={styles.kpiValue}>{shopReport.completedAppointments}</Text>
                  </View>
                  <View style={styles.kpiCard}>
                    <Ionicons name="time-outline" size={24} color="#FBD38D" />
                    <Text style={styles.kpiTitle}>Citas Pendientes</Text>
                    <Text style={styles.kpiValue}>{shopReport.pendingAppointments}</Text>
                  </View>
                  <View style={styles.kpiCard}>
                    <Ionicons name="close-circle-outline" size={24} color="#E53E3E" />
                    <Text style={styles.kpiTitle}>Citas Canceladas</Text>
                    <Text style={styles.kpiValue}>{shopReport.canceledAppointments}</Text>
                  </View>
                </View>
              </>
            )}

            {/* Main Report Analytics Section (using existing card structure) */}
            <View style={styles.reportsAnalyticsSection}>
              {shopReport && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Servicios Más Populares</Text>
                  {shopReport.servicePopularity.length > 0 ? (
                    shopReport.servicePopularity.slice(0, 5).map((service, index) => (
                      <View key={index} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{service.name}:</Text>
                        <Text style={styles.detailValue}>{service.count} citas (€{service.revenue.toFixed(2)})</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>No hay datos de servicios.</Text>
                  )}
                </View>
              )}

              {/* Hairdresser Reports (if 'all' selected) */}
              {hairdresserReports.length > 0 && selectedPeluqueroId === 'all' && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Rendimiento por Peluquero</Text>
                  {hairdresserReports.map((hReport) => (
                    <View key={hReport.id} style={styles.subCard}>
                      <Text style={styles.subCardTitle}>{hReport.nombre}</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos Totales:</Text>
                        <Text style={styles.detailValue}>€{hReport.revenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos con Tarjeta:</Text>
                        <Text style={styles.detailValue}>€{hReport.cardRevenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos en Efectivo:</Text>
                        <Text style={styles.detailValue}>€{hReport.cashRevenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Citas Completadas:</Text>
                        <Text style={styles.detailValue}>{hReport.completedAppointments}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Precio Promedio/Cita:</Text>
                        <Text style={styles.detailValue}>€{hReport.avgPricePerAppointment.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Hairdresser Report (if specific hairdresser selected) */}
              {hairdresserReports.length > 0 && selectedPeluqueroId !== 'all' && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Rendimiento de {peluqueros.find(p => p.id === selectedPeluqueroId)?.nombre}</Text>
                  {hairdresserReports.filter(h => h.id === selectedPeluqueroId).map((hReport) => (
                    <View key={hReport.id} style={styles.subCard}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos Totales:</Text>
                        <Text style={styles.detailValue}>€{hReport.revenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos con Tarjeta:</Text>
                        <Text style={styles.detailValue}>€{hReport.cardRevenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ingresos en Efectivo:</Text>
                        <Text style={styles.detailValue}>€{hReport.cashRevenue.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Citas Completadas:</Text>
                        <Text style={styles.detailValue}>{hReport.completedAppointments}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Precio Promedio/Cita:</Text>
                        <Text style={styles.detailValue}>€{hReport.avgPricePerAppointment.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Detailed Appointments List (Ahora agrupado por día) */}
            {Object.keys(groupedAppointments).length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Detalle de Citas</Text>
                {Object.keys(groupedAppointments).sort().map(dateKey => (
                  <View key={dateKey}>
                    <View style={styles.dailyHeader}>
                      <Text style={styles.dailyHeaderText}>
                        {dayjs(dateKey).locale('es').format('dddd, D [de] MMMM [de] YYYY')}
                      </Text>
                    </View>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Hora</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Cliente</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Peluquero</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Servicio</Text>
                        <Text style={[styles.tableHeaderText, { flex: 0.8, textAlign: 'right' }]}>Precio</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Pago</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Estado</Text>
                    </View>
                    {groupedAppointments[dateKey].map((reserva) => (
                      <View key={reserva.id} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 0.8 }]}>{reserva.hora}</Text>
                        <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{reserva.clienteNombre}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>
                          {peluqueros.find(p => p.id === reserva.peluqueroId)?.nombre || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>
                          {servicios.find(s => s.id === reserva.servicioId)?.nombre || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'right' }]}>
                          €{(servicios.find(s => s.id === reserva.servicioId)?.precio || 0).toFixed(2)}
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                { flex: 1, textAlign: 'center' },
                                reserva.metodoPago === 'tarjeta' && { color: '#4299E1', fontWeight: 'bold' },
                                reserva.metodoPago === 'efectivo' && { color: '#48BB78', fontWeight: 'bold' },
                            ]}
                        >
                            {reserva.metodoPago ? reserva.metodoPago.charAt(0).toUpperCase() + reserva.metodoPago.slice(1) : 'N/A'}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            { flex: 1, textAlign: 'center' },
                            reserva.estado === 'completada' && styles.completedStatusText,
                            reserva.estado === 'pendiente' && styles.pendingStatusText,
                            reserva.estado === 'cancelada' && styles.canceledStatusText,
                          ]}
                        >
                          {reserva.estado}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="stats-chart-outline" size={60} color="#FC8181" />
                <Text style={styles.emptyStateText}>No hay datos de informes para el período seleccionado.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}