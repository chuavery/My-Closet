import React from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useSettings } from "@/viewmodels/useSettings";
import { useTheme } from "@/providers/ThemeContext";
import { ThemeMode } from "@/models/UserSettings";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { Sun, Moon, Monitor } from "lucide-react-native";

const THEME_OPTIONS: { mode: ThemeMode; icon: typeof Sun }[] = [
    { mode: "light", icon: Sun },
    { mode: "dark", icon: Moon },
    { mode: "system", icon: Monitor },
];

export default function SettingsScreen() {
    const { settings, loading, toggleWearHistory, setThemeMode } =
        useSettings();
    const { colors } = useTheme();

    if (loading) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.paper }]}>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>
                    Appearance
                </Text>
                <View
                    style={[
                        styles.row,
                        {
                            backgroundColor: colors.white,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.rowInfo}>
                        <Text style={[styles.label, { color: colors.ink }]}>
                            Theme
                        </Text>
                        <Text
                            style={[
                                styles.description,
                                { color: colors.inkLight },
                            ]}
                        >
                            System Appearance
                        </Text>
                    </View>
                </View>
                <View style={styles.themeButtons}>
                    {THEME_OPTIONS.map((opt) => {
                        const isActive = settings.themeMode === opt.mode;
                        const Icon = opt.icon;
                        return (
                            <Pressable
                                key={opt.mode}
                                style={[
                                    styles.themeButton,
                                    {
                                        backgroundColor: isActive
                                            ? colors.accent
                                            : colors.white,
                                        borderColor: isActive
                                            ? colors.accent
                                            : colors.border,
                                    },
                                ]}
                                onPress={() => setThemeMode(opt.mode)}
                            >
                                <Icon
                                    size={20}
                                    color={
                                        isActive
                                            ? colors.surface
                                            : colors.inkMuted
                                    }
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>
                    Wear Tracking
                </Text>
                <View
                    style={[
                        styles.row,
                        {
                            backgroundColor: colors.white,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.rowInfo}>
                        <Text style={[styles.label, { color: colors.ink }]}>
                            Wear History
                        </Text>
                        <Text
                            style={[
                                styles.description,
                                { color: colors.inkLight },
                            ]}
                        >
                            Track how often you wear items
                        </Text>
                    </View>
                    <Switch
                        value={settings.wearHistoryEnabled}
                        onValueChange={toggleWearHistory}
                        trackColor={{
                            false: colors.border,
                            true: colors.accentLight,
                        }}
                        thumbColor={
                            settings.wearHistoryEnabled
                                ? colors.accent
                                : colors.white
                        }
                    />
                </View>
            </View>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>
                    About
                </Text>
                <Text style={[styles.aboutText, { color: colors.inkLight }]}>
                    My Closet v1.0
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xxxl,
    },
    sectionTitle: {
        ...typography.caption,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    rowInfo: {
        flex: 1,
        marginRight: spacing.lg,
    },
    label: {
        ...typography.body,
        fontWeight: "600",
    },
    description: {
        ...typography.bodySmall,
        marginTop: 2,
    },
    themeButtons: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    themeButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    aboutText: {
        ...typography.body,
    },
});
