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
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { Plus, Scan } from "lucide-react-native";

export default function StorageScreen() {
    const router = useRouter();
    const {
        spaces,
        articlesBySpace,
        unassignedArticles,
        loading,
        deleteSpace,
    } = useStorageSpaces();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {unassignedArticles.length > 0 && (
                <View style={styles.notice}>
                    <Text style={styles.noticeText}>
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
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No storage spaces yet</Text>
                }
            />
            <View style={styles.fabRow}>
                <Pressable
                    style={styles.scanFab}
                    onPress={() => router.push("/storage/scan")}
                >
                    <Scan size={24} color={colors.accent} />
                </Pressable>
                <Pressable
                    style={styles.fab}
                    onPress={() => router.push("/storage/new")}
                >
                    <Plus size={24} color={colors.white} />
                </Pressable>
            </View>
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
    notice: {
        margin: spacing.lg,
        padding: spacing.md,
        backgroundColor: colors.accentLight + "20",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
    },
    noticeText: {
        ...typography.bodySmall,
        color: colors.accentDark,
    },
    listContainer: {
        flex: 1,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    empty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        marginTop: spacing.xxxl,
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
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    fab: {
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
});
