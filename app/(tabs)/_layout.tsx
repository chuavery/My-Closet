import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "@/providers/ThemeContext";

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
                    backgroundColor: colors.white,
                    borderTopColor: colors.border,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Closet",
                    headerTitle: "My Closet",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <TabIcon label="衣" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="outfits"
                options={{
                    title: "Outfits",
                    headerTitle: "Outfits",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <TabIcon label="O" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="spaces"
                options={{
                    title: "Storage",
                    headerTitle: "Storage Spaces",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <TabIcon label="#" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerTitle: "Settings",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <TabIcon label="*" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

function TabIcon({ label, color }: { label: string; color: string }) {
    return (
        <Text style={{ fontSize: 18, color, fontWeight: "700" }}>{label}</Text>
    );
}
