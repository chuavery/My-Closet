import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useRepositories } from "@/providers/RepositoryProvider";
import { StorageSpace } from "@/models/StorageSpace";
import { Article } from "@/models/Article";
import { ArticleCard } from "@/components/ArticleCard";
import { QRTile } from "@/components/QRTile";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { Plus, Pencil } from "lucide-react-native";

export default function StorageSpaceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation();
    const { storageSpaceRepository, articleRepository } = useRepositories();
    const [space, setSpace] = useState<StorageSpace | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [unassignedArticles, setUnassignedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSubLocation, setEditSubLocation] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const load = useCallback(async () => {
        if (!id) return;
        const [spaceData, articlesData, unassigned] = await Promise.all([
            storageSpaceRepository.getById(id),
            articleRepository.getByStorageSpace(id),
            articleRepository.getUnassigned(),
        ]);
        setSpace(spaceData);
        setArticles(articlesData);
        setUnassignedArticles(unassigned);
        setLoading(false);
    }, [id, storageSpaceRepository, articleRepository]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (space && !editing) {
            setEditName(space.name);
            setEditSubLocation(space.subLocation ?? "");
        }
    }, [space, editing]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => setEditing(!editing)}>
                    {editing ? (
                        <Text style={styles.headerButton}>Cancel</Text>
                    ) : (
                        <Pencil size={20} color={colors.accent} />
                    )}
                </Pressable>
            ),
        });
    }, [navigation, editing]);

    const handleSave = async () => {
        if (!id || !space) return;
        if (!editName.trim()) {
            Alert.alert("Name required", "Please enter a name for this storage space.");
            return;
        }
        await storageSpaceRepository.update(id, {
            name: editName.trim(),
            subLocation: editSubLocation.trim() || undefined,
        });
        setEditing(false);
        await load();
    };

    const handleAssign = async (articleId: string) => {
        if (!id) return;
        await articleRepository.setStorageSpace(articleId, id);
        setShowPicker(false);
        await load();
    };

    const handleUnassign = async (articleId: string) => {
        Alert.alert("Remove Article", "Remove this article from this space?", [
            { text: "Cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: async () => {
                    await articleRepository.setStorageSpace(articleId, null);
                    await load();
                },
            },
        ]);
    };

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
                {editing ? (
                    <>
                        <TextInput
                            style={styles.nameInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Space name"
                            placeholderTextColor={colors.inkLight}
                        />
                        <TextInput
                            style={styles.subInput}
                            value={editSubLocation}
                            onChangeText={setEditSubLocation}
                            placeholder="Sub-location (optional)"
                            placeholderTextColor={colors.inkLight}
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.name}>{space.name}</Text>
                        {space.subLocation && (
                            <Text style={styles.subLocation}>{space.subLocation}</Text>
                        )}
                    </>
                )}
            </View>
            <View style={styles.qrSection}>
                <QRTile value={space.qrCodeValue} label={space.name} />
            </View>

            {editing && (
                <View style={styles.editActions}>
                    <Pressable style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveLabel}>Save Changes</Text>
                    </Pressable>
                    <Pressable style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteLabel}>Delete Space</Text>
                    </Pressable>
                </View>
            )}

            <Text style={styles.sectionTitle}>
                Articles ({articles.length})
            </Text>
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <Pressable
                        onLongPress={() => editing && handleUnassign(item.id)}
                    >
                        <ArticleCard
                            article={item}
                            onPress={() => router.push(`/article/${item.id}`)}
                        />
                    </Pressable>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No articles here yet</Text>
                }
            />

            {editing && (
                <Pressable style={styles.fab} onPress={() => setShowPicker(true)}>
                    <Plus size={24} color={colors.white} />
                </Pressable>
            )}

            {showPicker && (
                <View style={styles.pickerOverlay}>
                    <View style={styles.pickerContent}>
                        <Text style={styles.pickerTitle}>
                            {unassignedArticles.length > 0
                                ? "Select an article to assign"
                                : "No unassigned articles available"}
                        </Text>
                        {unassignedArticles.length > 0 ? (
                            <FlatList
                                data={unassignedArticles}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                contentContainerStyle={styles.pickerList}
                                columnWrapperStyle={styles.pickerRow}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => handleAssign(item.id)}
                                    >
                                        <ArticleCard article={item} />
                                    </Pressable>
                                )}
                            />
                        ) : null}
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setShowPicker(false)}
                        >
                            <Text style={styles.cancelLabel}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            )}
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
    subLocation: {
        ...typography.body,
        color: colors.inkLight,
        marginTop: spacing.xs,
    },
    nameInput: {
        ...typography.h2,
        color: colors.ink,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.xs,
    },
    subInput: {
        ...typography.body,
        color: colors.ink,
        marginTop: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.xs,
    },
    qrSection: {
        alignItems: "center",
        padding: spacing.lg,
    },
    editActions: {
        paddingHorizontal: spacing.lg,
    },
    saveButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: "center",
    },
    saveLabel: {
        ...typography.button,
        color: colors.white,
    },
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 8,
    },
    deleteLabel: {
        ...typography.button,
        color: colors.error,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.ink,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    listContainer: {
        flex: 1,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
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
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    pickerContent: {
        backgroundColor: colors.paper,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        maxHeight: "70%",
        padding: spacing.lg,
    },
    pickerTitle: {
        ...typography.h3,
        color: colors.ink,
        marginBottom: spacing.md,
    },
    pickerList: {
        paddingBottom: spacing.md,
    },
    pickerRow: {
        justifyContent: "space-between",
    },
    cancelButton: {
        marginTop: spacing.md,
        padding: spacing.sm,
        alignItems: "center",
    },
    cancelLabel: {
        ...typography.button,
        color: colors.inkLight,
    },
});
