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
import { useRouter } from "expo-router";
import { useStorageSpaces } from "@/viewmodels/useStorageSpaces";
import { StorageSpace } from "@/models/StorageSpace";
import { StorageSpaceRow } from "@/components/StorageSpaceRow";
import { useTheme } from "@/providers/ThemeContext";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { Plus, Scan, ArchiveX } from "lucide-react-native";

export default function StorageScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        spaces,
        articlesBySpace,
        unassignedArticles,
        loading,
        deleteSpace,
    } = useStorageSpaces();

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {unassignedArticles.length > 0 && (
                <View style={[styles.notice, {
                    backgroundColor: colors.accent + "20",
                    borderLeftColor: colors.accent,
                }]}>
                    <Text style={[styles.noticeText, { color: colors.accent }]}>
                        {unassignedArticles.length} unassigned article
                        {unassignedArticles.length > 1 ? "s" : ""}
                    </Text>
                </View>
            )}
            <FlatList<StorageSpace>
                data={spaces}
                keyExtractor={(item) => item.id}
                style={styles.listContainer}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <StorageSpaceRow
                        space={item}
                        articleCount={(articlesBySpace[item.id] ?? []).length}
                        onPress={() => router.push(`/storage/${item.id}`)}
                        onDelete={() => {
                            Alert.alert(
                                "Delete Space",
                                `Delete "${item.name}"? Articles in this space will be unassigned.`,
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Delete",
                                        style: "destructive",
                                        onPress: () => deleteSpace(item.id),
                                    },
                                ]
                            );
                        }}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ArchiveX size={48} color={colors.inkMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.inkPrimary }]}>No storage spaces yet</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.inkSecondary }]}>
                            Tap + to create your first space
                        </Text>
                    </View>
                }
            />
            <View style={styles.fabRow}>
                <Pressable
                    style={[styles.scanFab, {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    }]}
                    onPress={() => router.push("/storage/scan")}
                >
                    <Scan size={24} color={colors.accent} />
                </Pressable>
                <Pressable
                    style={[styles.fab, {
                        backgroundColor: colors.accent,
                        shadowColor: colors.inkPrimary,
                    }]}
                    onPress={() => router.push("/storage/new")}
                >
                    <Plus size={24} color={colors.surface} />
                </Pressable>
            </View>
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
    notice: {
        margin: spacing.lg,
        padding: spacing.md,
        borderRadius: 8,
        borderLeftWidth: 3,
    },
    noticeText: {
        ...typography.bodySmall,
    },
    listContainer: {
        flex: 1,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 130,
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
    fabRow: {
        position: "absolute",
        right: spacing.xl,
        bottom: spacing.xl,
        flexDirection: "row",
        gap: spacing.md,
    },
    scanFab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
    },
    fab: {
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
