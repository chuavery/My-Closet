import { Stack } from "expo-router";
import { RepositoryProvider } from "@/providers/RepositoryProvider";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <RepositoryProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#F5F0E8" },
                    headerTintColor: "#2C2C2C",
                    contentStyle: { backgroundColor: "#F5F0E8" },
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
        </RepositoryProvider>
    );
}
