import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../styles/layoutAdmin.styles';

export default function AdminTabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    marginTop: -30,
                    ...styles.tabBar,
                    paddingBottom: insets.bottom + 0,
                    paddingTop: 0,
                    height: 90,
                },
                tabBarActiveTintColor: '#9F7AEA',
                tabBarInactiveTintColor: '#A0AEC0',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Agenda',
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons name="calendar-outline" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="clientes"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons name="people-outline" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="servicios"
                options={{
                    title: 'Servicios',
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons name="cut-outline" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="administracion"
                options={{
                    title: 'Admin',
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons name="settings-outline" size={size} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
