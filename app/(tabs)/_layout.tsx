import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A202C",
          borderTopWidth: 1,
          borderTopColor: "#2D3748",
          // Aquí usamos `insets.bottom` para empujar la barra de pestañas
          // por encima del menú de navegación del sistema.
          paddingBottom: insets.bottom ,
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: "#9F7AEA",
        tabBarInactiveTintColor: "#A0AEC0",
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];

          if (route.name === "index") {
            iconName = "calendar-outline";
          } else if (route.name === "perfil") {
            iconName = "person-outline";
          } else if (route.name === "reservas") {
            iconName = "time-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Reservar" }} />
      <Tabs.Screen name="reservas" options={{ title: "Mis Reservas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
