import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRepositories } from "@/providers/RepositoryProvider";
import { StorageSpace } from "@/models/StorageSpace";
import { Article } from "@/models/Article";
import { ArticleCard } from "@/components/ArticleCard";
import { QRTile } from "@/components/QRTile";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

export default function StorageSpaceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { storageSpaceRepository, articleRepository } = useRepositories();
    const [space, setSpace] = useState<StorageSpace | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!id) return;
            const [spaceData, articlesData] = await Promise.all([
                storageSpaceRepository.getById(id),
                articleRepository.getByStorageSpace(id),
            ]);
            setSpace(spaceData);
            setArticles(articlesData);
            setLoading(false);
        }
        load();
    }, [id, storageSpaceRepository, articleRepository]);

    const handleDelete = async () => {
        if (!id) return;
        Alert.alert(
            "Delete Space",
            "Articles in this space will be unassigned. Continue?",
            [
                { text: "Cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await storageSpaceRepository.delete(id);
                        router.back();
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!space) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>Space not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{space.name}</Text>
                {space.subLocation && (
                    <Text style={styles.subLocation}>{space.subLocation}</Text>
                )}
            </View>
            <View style={styles.qrSection}>
                <QRTile value={space.qrCodeValue} label={space.name} />
            </View>
            <Text style={styles.sectionTitle}>
                Articles ({articles.length})
            </Text>
            <FlatList
                data={articles}
                keyExtractor={(item: { id: any }) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                renderItem={({ item }: { item: Article }) => (
                    <ArticleCard
                        article={item}
                        onPress={() => router.push(`/article/${item.id}`)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No articles here yet</Text>
                }
            />
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteLabel}>Delete Space</Text>
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
    header: {
        padding: spacing.lg,
        paddingBottom: 0,
    },
    name: {
        ...typography.h2,
        color: colors.ink,
    },
    subLocation: {
        ...typography.body,
        color: colors.inkLight,
        marginTop: spacing.xs,
    },
    qrSection: {
        alignItems: "center",
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.ink,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
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
    deleteButton: {
        margin: spacing.lg,
        padding: spacing.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 8,
    },
    deleteLabel: {
        ...typography.button,
        color: colors.error,
    },
});
