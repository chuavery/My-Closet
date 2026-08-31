import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Outfit } from "@/models/Outfit";
import { useRepositories } from "@/providers/RepositoryProvider";
import { useTheme } from "@/providers/ThemeContext";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { Plus, Layers } from "lucide-react-native";

export default function OutfitsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { outfitRepository } = useRepositories();
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        outfitRepository.getAll().then((data) => {
            setOutfits(data);
            setLoading(false);
        });
    }, [outfitRepository]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList<Outfit>
                data={outfits}
                keyExtractor={(item) => item.id}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push(`/outfit/${item.id}`)}
                    >
                        <View style={styles.cardContent}>
                            <Text style={[styles.name, { color: colors.inkPrimary }]}>{item.name}</Text>
                            <Text style={[styles.meta, { color: colors.inkSecondary }]}>
                                {item.wearCount} worn
                                {item.lastWornAt
                                    ? ` · Last: ${new Date(
                                          item.lastWornAt
                                      ).toLocaleDateString()}`
                                    : ""}
                            </Text>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Layers size={48} color={colors.inkMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.inkPrimary }]}>No outfits yet</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.inkSecondary }]}>
                            Tap + to create your first outfit
                        </Text>
                    </View>
                }
            />
            <Pressable
                style={[styles.fab, {
                    backgroundColor: colors.accent,
                    shadowColor: colors.inkPrimary,
                }]}
                onPress={() => router.push("/outfit/builder")}
            >
                <Plus size={24} color={colors.surface} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        flex: 1,
    },
    list: {
        padding: spacing.lg,
        paddingBottom: 130,
    },
    card: {
        borderRadius: borderRadius.md,
        borderWidth: 1,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    cardContent: {},
    name: {
        ...typography.h3,
    },
    meta: {
        ...typography.bodySmall,
        marginTop: spacing.xs,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: spacing.xxxxl,
        gap: spacing.sm,
    },
    emptyTitle: {
        ...typography.h3,
        textAlign: "center",
    },
    emptySubtitle: {
        ...typography.body,
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        right: spacing.xl,
        bottom: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
