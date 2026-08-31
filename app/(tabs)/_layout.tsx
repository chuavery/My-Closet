import { Tabs } from "expo-router";
import { useTheme } from "@/providers/ThemeContext";
import { Shirt, Handbag, ArchiveX, Settings } from "lucide-react-native";

export default function TabLayout() {
    const { colors } = useTheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.inkLight,
                headerStyle: { backgroundColor: colors.paper },
                headerTintColor: colors.ink,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Closet",
                    headerTitle: "My Closet",
                    tabBarIcon: ({ color, size }) => (
                        <Shirt size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="outfits"
                options={{
                    title: "Outfits",
                    headerTitle: "Outfits",
                    tabBarIcon: ({ color, size }) => (
                        <Handbag size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="spaces"
                options={{
                    title: "Storage",
                    headerTitle: "Storage Spaces",
                    tabBarIcon: ({ color, size }) => (
                        <ArchiveX size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerTitle: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Settings size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
