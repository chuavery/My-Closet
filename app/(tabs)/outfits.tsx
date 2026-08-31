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
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

export default function OutfitsScreen() {
    const router = useRouter();
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
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList<Outfit>
                data={outfits}
                keyExtractor={(item) => item.id}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => router.push(`/outfit/${item.id}`)}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.meta}>
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
                    <Text style={styles.empty}>No outfits yet</Text>
                }
            />
            <Pressable
                style={styles.fab}
                onPress={() => router.push("/outfit/builder")}
            >
                <Text style={styles.fabText}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.paper,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.paper,
    },
    listContainer: {
        flex: 1,
    },
    list: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    cardContent: {},
    name: {
        ...typography.h3,
        color: colors.ink,
    },
    meta: {
        ...typography.bodySmall,
        color: colors.inkLight,
        marginTop: spacing.xs,
    },
    empty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        marginTop: spacing.xxxl,
    },
    fab: {
        position: "absolute",
        right: spacing.xl,
        bottom: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.accent,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fabText: {
        ...typography.h2,
        color: colors.white,
    },
});
