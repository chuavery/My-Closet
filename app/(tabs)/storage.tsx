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
import { StorageSpaceRow } from "@/components/StorageSpaceRow";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";

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
            <FlatList
                data={spaces}
                keyExtractor={(item: { id: any }) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }: { item: { id: string } }) => (
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
});
