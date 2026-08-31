import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useOutfitList } from "@/viewmodels/useOutfitList";
import { OutfitSummary } from "@/models/OutfitSummary";
import { useTheme } from "@/providers/ThemeContext";
import { occasionTagStyles } from "@/theme/chipStyles";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { Plus, Layers } from "lucide-react-native";

export default function OutfitsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { outfits, loading } = useOutfitList();

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList<OutfitSummary>
                data={outfits}
                keyExtractor={(item) => item.outfit.id}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const tagStyle = occasionTagStyles(colors);
                    return (
                        <Pressable
                            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => router.push(`/outfit/${item.outfit.id}`)}
                        >
                            <View style={styles.cardContent}>
                                <Text style={[styles.name, { color: colors.inkPrimary }]}>{item.outfit.name}</Text>
                                {item.tags.length > 0 && (
                                    <View style={styles.tags}>
                                        {item.tags.map((tag) => (
                                            <View key={tag.id} style={tagStyle.container}>
                                                <Text style={tagStyle.label}>{tag.name}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <Text style={[styles.meta, { color: colors.inkSecondary }]}>
                                    {item.articleCount} {item.articleCount === 1 ? "piece" : "pieces"}
                                </Text>
                            </View>
                        </Pressable>
                    );
                }}
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
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
        marginTop: spacing.xs,
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
