import { Stack, useRouter } from "expo-router";
import { RepositoryProvider } from "@/providers/RepositoryProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayoutInner() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.paper },
                    headerTintColor: colors.ink,
                    contentStyle: { backgroundColor: colors.paper },
                    headerBackButtonDisplayMode: "minimal",
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()}>
                            <ChevronLeft size={24} color={colors.ink} />
                        </Pressable>
                    ),
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
                    options={{
                        title: "Scan QR Code",
                        presentation: "fullScreenModal",
                    }}
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RepositoryProvider>
                <ThemeProvider>
                    <RootLayoutInner />
                </ThemeProvider>
            </RepositoryProvider>
        </GestureHandlerRootView>
    );
}
