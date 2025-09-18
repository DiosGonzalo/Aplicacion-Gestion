import dayjs from "dayjs";

export const getDurationInMinutes = (durationStr: string): number => {
  const parts = durationStr.split(" ");
  let totalMinutes = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];
    if (unit.startsWith("min")) {
      totalMinutes += value;
    } else if (unit.startsWith("hora")) {
      totalMinutes += value * 60;
    }
  }
  return totalMinutes;
};

export const generateAllPossibleHours = (): string[] => {
  const hours: string[] = [];
  let current = dayjs().startOf("day");
  const end = dayjs().startOf("day").add(24, "hours");

  while (current.isBefore(end)) {
    hours.push(current.format("HH:mm"));
    current = current.add(30, "minutes");
  }

  return hours;
};

export type Peluquero = {
  id: string;
  nombre: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: string;
};

export type Reserva = {
  id: string;
  clienteNombre: string;
  peluqueroId: string;
  fecha: string;
  hora: string;
  clienteId?: string;
  clienteTelefono?: string;
  servicioId: string;
  estado: "pendiente" | "completada" | "cancelada" | "no asistido";
  metodoPago?: "tarjeta" | "efectivo" | "bono";
  createdAt?: string;
};

export type UserData = {
  id: string;
  nombre: string;
  telefono?: string;
  reputacion: "buena" | "regular" | "mala";
  tieneBono?: boolean;
};

export type WorkingHoursEntry = {
  start: string;
  end: string;
};

export type ShopSchedule = {
  days: Record<string, WorkingHoursEntry[]>;
};