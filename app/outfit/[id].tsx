import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useOutfitDetail } from "@/viewmodels/useOutfitDetail";
import { Article } from "@/models/Article";
import { ArticleCard } from "@/components/ArticleCard";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

export default function OutfitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation();
    const {
        outfit,
        articles,
        tags,
        wearHistoryEnabled,
        loading,
    } = useOutfitDetail(id ?? "");

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => router.push(`/outfit/builder?id=${id}`)}>
                    <Text style={styles.headerButton}>Edit</Text>
                </Pressable>
            ),
        });
    }, [navigation, router, id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!outfit) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>Outfit not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{outfit.name}</Text>
                {wearHistoryEnabled && (
                    <Text style={styles.meta}>
                        {outfit.wearCount} worn
                        {outfit.lastWornAt
                            ? ` · Last: ${new Date(outfit.lastWornAt).toLocaleDateString()}`
                            : ""}
                    </Text>
                )}
            </View>

            {tags.length > 0 && (
                <View style={styles.tags}>
                    {tags.map((tag) => (
                        <View key={tag.id} style={styles.tag}>
                            <Text style={styles.tagLabel}>{tag.name}</Text>
                        </View>
                    ))}
                </View>
            )}

            <Text style={styles.sectionTitle}>Articles</Text>
            <FlatList<Article>
                data={articles}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <ArticleCard
                        article={item}
                        onPress={() => router.push(`/article/${item.id}`)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No articles in this outfit</Text>
                }
            />
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
    headerButton: {
        ...typography.buttonSmall,
        color: colors.accent,
    },
    header: {
        padding: spacing.lg,
        paddingBottom: 0,
    },
    name: {
        ...typography.h2,
        color: colors.ink,
    },
    meta: {
        ...typography.bodySmall,
        color: colors.inkLight,
        marginTop: spacing.xs,
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: spacing.lg,
        gap: spacing.xs,
    },
    tag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        backgroundColor: colors.accent + "20",
    },
    tagLabel: {
        ...typography.caption,
        color: colors.accent,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.ink,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    listContainer: {
        flex: 1,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    row: {
        justifyContent: "space-between",
    },
    empty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        marginTop: spacing.xxxl,
    },
});
