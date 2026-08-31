import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Modal,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useClosetHome } from "@/viewmodels/useClosetHome";
import { Article } from "@/models/Article";
import { ArticleCard } from "@/components/ArticleCard";
import { FilterChipRow } from "@/components/FilterChipRow";
import { useTheme } from "@/providers/ThemeContext";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { Plus, ListFilter, Shirt } from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const FITS = [
    { label: "All", value: "" },
    { label: "Slim", value: "slim" },
    { label: "Regular", value: "regular" },
    { label: "Straight", value: "straight" },
    { label: "Oversized", value: "oversized" },
    { label: "Relaxed", value: "relaxed" },
    { label: "Tailored", value: "tailored" },
];

export default function ClosetScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        articles,
        searchQuery,
        setSearchQuery,
        filters,
        setFilter,
        loading,
    } = useClosetHome();
    const [showFilterSheet, setShowFilterSheet] = useState(false);

    const hasActiveFilters = filters.articleType !== null || filters.color !== null || filters.fit !== null;
    const activeFilterCount = [filters.articleType, filters.color, filters.fit].filter(Boolean).length;

    const sheetY = useSharedValue(SCREEN_HEIGHT);
    const backdropOpacity = useSharedValue(0);

    const openSheet = () => {
        sheetY.value = withSpring(0, { damping: 20, stiffness: 200 });
        backdropOpacity.value = withSpring(1, { damping: 20, stiffness: 200 });
        setShowFilterSheet(true);
    };

    const closeSheet = () => {
        sheetY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 200 });
        backdropOpacity.value = withSpring(0, { damping: 20, stiffness: 200 });
        runOnJS(setShowFilterSheet)(false);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) {
                sheetY.value = e.translationY;
                backdropOpacity.value = Math.max(0, 1 - e.translationY / SCREEN_HEIGHT);
            }
        })
        .onEnd((e) => {
            if (e.translationY > 100 || e.velocityY > 500) {
                runOnJS(closeSheet)();
            } else {
                sheetY.value = withSpring(0, { damping: 20, stiffness: 200 });
                backdropOpacity.value = withSpring(1, { damping: 20, stiffness: 200 });
            }
        });

    const sheetAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sheetY.value }],
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchRow}>
                <TextInput
                    style={[styles.searchInput, {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.inkPrimary,
                    }]}
                    placeholder="Search articles..."
                    placeholderTextColor={colors.inkMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Pressable
                    style={[
                        styles.filterButton,
                        {
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                        },
                        (showFilterSheet || hasActiveFilters) && {
                            backgroundColor: colors.accent,
                            borderColor: colors.accent,
                        },
                    ]}
                    onPress={openSheet}
                >
                    <ListFilter
                        size={16}
                        color={
                            (showFilterSheet || hasActiveFilters)
                                ? colors.surface
                                : colors.inkPrimary
                        }
                    />
                    {activeFilterCount > 0 && (
                        <View style={[styles.filterBadge, { backgroundColor: colors.destructive }]}>
                            <Text style={[styles.filterBadgeText, { color: colors.surface }]}>{activeFilterCount}</Text>
                        </View>
                    )}
                </Pressable>
            </View>
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
                    <View style={styles.emptyContainer}>
                        <Shirt size={48} color={colors.inkMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.inkPrimary }]}>No articles yet</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.inkSecondary }]}>
                            Tap + to add your first piece
                        </Text>
                    </View>
                }
            />
            <Pressable
                style={[styles.fab, {
                    backgroundColor: colors.accent,
                    shadowColor: colors.inkPrimary,
                }]}
                onPress={() => router.push("/article/new")}
            >
                <Plus size={24} color={colors.surface} />
            </Pressable>

            <Modal transparent visible={showFilterSheet} onRequestClose={closeSheet}>
                <View style={styles.sheetOverlay}>
                    <Animated.View style={[styles.sheetBackdrop, backdropAnimatedStyle]}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
                    </Animated.View>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[styles.sheetContent, { backgroundColor: colors.background }, sheetAnimatedStyle]}>
                            <View style={styles.sheetHandle}>
                                <View style={[styles.handleBar, { backgroundColor: colors.inkMuted }]} />
                            </View>
                            <Text style={[styles.sheetTitle, { color: colors.inkPrimary }]}>Filters</Text>

                            <Text style={[styles.filterCategoryLabel, { color: colors.inkSecondary }]}>TYPE</Text>
                            <FilterChipRow
                                options={ARTICLE_TYPES}
                                selectedValue={filters.articleType}
                                onSelect={(v: string | null) => setFilter("articleType", v)}
                            />

                            <Text style={[styles.filterCategoryLabel, { color: colors.inkSecondary }]}>COLOR</Text>
                            <FilterChipRow
                                options={COLORS}
                                selectedValue={filters.color}
                                onSelect={(v: string | null) => setFilter("color", v)}
                            />

                            <Text style={[styles.filterCategoryLabel, { color: colors.inkSecondary }]}>FIT</Text>
                            <FilterChipRow
                                options={FITS}
                                selectedValue={filters.fit}
                                onSelect={(v: string | null) => setFilter("fit", v)}
                            />

                            {hasActiveFilters && (
                                <Pressable
                                    style={[styles.clearButton, { borderColor: colors.destructive }]}
                                    onPress={() => {
                                        setFilter("articleType", null);
                                        setFilter("color", null);
                                        setFilter("fit", null);
                                    }}
                                >
                                    <Text style={[styles.clearLabel, { color: colors.destructive }]}>Clear All Filters</Text>
                                </Pressable>
                            )}
                        </Animated.View>
                    </GestureDetector>
                </View>
            </Modal>
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
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        margin: spacing.lg,
        gap: spacing.sm,
    },
    searchInput: {
        ...typography.body,
        flex: 1,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    filterButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    filterBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: "700",
    },
    listContainer: {
        flex: 1,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 130,
    },
    row: {
        justifyContent: "space-between",
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
    sheetOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    sheetBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheetContent: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 40,
        maxHeight: "70%",
    },
    sheetHandle: {
        alignItems: "center",
        paddingVertical: spacing.sm,
    },
    handleBar: {
        width: 36,
        height: 4,
        borderRadius: 2,
    },
    sheetTitle: {
        ...typography.h3,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    filterCategoryLabel: {
        ...typography.caption,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    clearButton: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
    },
    clearLabel: {
        ...typography.button,
    },
});
