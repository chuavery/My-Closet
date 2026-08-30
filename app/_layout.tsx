import { Stack } from "expo-router";
import { RepositoryProvider } from "@/providers/RepositoryProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeContext";
import { StatusBar } from "expo-status-bar";

function RootLayoutInner() {
    const { colors, isDark } = useTheme();
    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.paper },
                    headerTintColor: colors.ink,
                    contentStyle: { backgroundColor: colors.paper },
                    headerBackTitle: "Back",
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="article/new"
                    options={{ title: "Add Article" }}
                />
                <Stack.Screen
                    name="article/[id]"
                    options={{ title: "Article" }}
                />
                <Stack.Screen
                    name="storage/[id]"
                    options={{ title: "Storage Space" }}
                />
                <Stack.Screen
                    name="storage/new"
                    options={{ title: "New Storage Space" }}
                />
                <Stack.Screen
                    name="storage/scan"
                    options={{ title: "Scan QR Code", presentation: "fullScreenModal" }}
                />
                <Stack.Screen
                    name="outfit/builder"
                    options={{ title: "Outfit Builder" }}
                />
                <Stack.Screen
                    name="outfit/[id]"
                    options={{ title: "Outfit" }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <RepositoryProvider>
            <ThemeProvider>
                <RootLayoutInner />
            </ThemeProvider>
        </RepositoryProvider>
    );
}
