import React from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useClosetHome } from "@/viewmodels/useClosetHome";
import { ArticleCard } from "@/components/ArticleCard";
import { FilterChipRow } from "@/components/FilterChipRow";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";

const ARTICLE_TYPES = [
    { label: "All", value: "" },
    { label: "Shirts", value: "shirt" },
    { label: "Pants", value: "pants" },
    { label: "Dresses", value: "dress" },
    { label: "Shoes", value: "shoes" },
    { label: "Jackets", value: "jacket" },
    { label: "Accessories", value: "accessories" },
];

const COLORS = [
    { label: "All", value: "" },
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Blue", value: "blue" },
    { label: "Brown", value: "brown" },
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
];

export default function ClosetScreen() {
    const router = useRouter();
    const {
        articles,
        searchQuery,
        setSearchQuery,
        filters,
        setFilter,
        loading,
    } = useClosetHome();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search articles..."
                placeholderTextColor={colors.inkLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FilterChipRow
                options={ARTICLE_TYPES}
                selectedValue={filters.articleType}
                onSelect={(v: string | null) => setFilter("articleType", v)}
            />
            <FilterChipRow
                options={COLORS}
                selectedValue={filters.color}
                onSelect={(v: string | null) => setFilter("color", v)}
            />
            <FlatList
                data={articles}
                keyExtractor={(item: { id: any }) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                renderItem={({
                    item,
                }: {
                    item: { id: string; [key: string]: any };
                }) => (
                    <ArticleCard
                        // FIX: TypeScript error: Type '{ id: string; [key: string]: any; }' is not assignable to type 'Article'.
                        article={item}
                        onPress={() => router.push(`/article/${item.id}`)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No articles found</Text>
                }
            />
            <Pressable
                style={styles.fab}
                onPress={() => router.push("/article/new")}
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
    search: {
        ...typography.body,
        margin: spacing.lg,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.ink,
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
    fabText: {
        ...typography.h2,
        color: colors.white,
    },
});
