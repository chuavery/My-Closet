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
import { useTheme } from "@/providers/ThemeContext";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { occasionTagStyles } from "@/theme/chipStyles";
import { Pencil } from "lucide-react-native";

export default function OutfitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation();
    const { colors } = useTheme();
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
                    <Pencil size={20} color={colors.accent} />
                </Pressable>
            ),
        });
    }, [navigation, router, id, colors.accent]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!outfit) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={[styles.empty, { color: colors.inkSecondary }]}>Outfit not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.name, { color: colors.inkPrimary }]}>{outfit.name}</Text>
                {/* TODO: Wear History — re-enable when wear tracking is turned on
                {wearHistoryEnabled && (
                    <Text style={[styles.meta, { color: colors.inkSecondary }]}>
                        {outfit.wearCount} worn
                        {outfit.lastWornAt
                            ? ` · Last: ${new Date(outfit.lastWornAt).toLocaleDateString()}`
                            : ""}
                    </Text>
                )}
                */}
            </View>

            {tags.length > 0 && (
                <View style={styles.tags}>
                    {tags.map((tag) => {
                        const tagStyle = occasionTagStyles(colors);
                        return (
                            <View key={tag.id} style={tagStyle.container}>
                                <Text style={tagStyle.label}>{tag.name}</Text>
                            </View>
                        );
                    })}
                </View>
            )}

            <Text style={[styles.sectionTitle, { color: colors.inkPrimary }]}>Articles</Text>
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
                    <Text style={[styles.empty, { color: colors.inkSecondary }]}>No articles in this outfit</Text>
                }
            />
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
    header: {
        padding: spacing.lg,
        paddingBottom: 0,
    },
    name: {
        ...typography.h2,
    },
    meta: {
        ...typography.bodySmall,
        marginTop: spacing.xs,
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: spacing.lg,
        gap: spacing.xs,
    },
    sectionTitle: {
        ...typography.h3,
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
        textAlign: "center",
        marginTop: spacing.xxxl,
    },
});
