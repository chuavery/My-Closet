import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOutfitBuilder } from "@/viewmodels/useOutfitBuilder";
import { LayerType } from "@/models/OutfitArticle";
import { LayerSlot } from "@/components/LayerSlot";
import { ArticleListItem } from "@/components/ArticleListItem";
import { FilterChipRow } from "@/components/FilterChipRow";
import { useTheme } from "@/providers/ThemeContext";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { occasionTagStyles } from "@/theme/chipStyles";
import { ListFilter } from "lucide-react-native";

const LAYER_TYPES: LayerType[] = [
    "base", "mid", "outer", "bottom", "footwear", "accessory",
];

const ARTICLE_TYPES: { label: string; value: string }[] = [
    { label: "All", value: "" },
    { label: "Shirts", value: "shirt" },
    { label: "Pants", value: "pants" },
    { label: "Dresses", value: "dress" },
    { label: "Shoes", value: "shoes" },
    { label: "Jackets", value: "jacket" },
    { label: "Accessories", value: "accessories" },
];

const COLOR_OPTIONS: { label: string; value: string }[] = [
    { label: "All", value: "" },
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Blue", value: "blue" },
    { label: "Brown", value: "brown" },
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
];

const FIT_OPTIONS: { label: string; value: string }[] = [
    { label: "All", value: "" },
    { label: "Slim", value: "slim" },
    { label: "Regular", value: "regular" },
    { label: "Straight", value: "straight" },
    { label: "Oversized", value: "oversized" },
    { label: "Relaxed", value: "relaxed" },
    { label: "Tailored", value: "tailored" },
];

export default function OutfitBuilderScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const {
        outfit,
        setOutfit,
        outfitArticles,
        allArticles,
        allTags,
        selectedTagIds,
        setSelectedTagIds,
        addArticle,
        removeArticle,
        createTag,
        save,
        deleteOutfit,
        saving,
    } = useOutfitBuilder(id);

    const [showArticlePicker, setShowArticlePicker] = useState(false);
    const [activeLayer, setActiveLayer] = useState<LayerType>("base");
    const [pickerSearch, setPickerSearch] = useState("");
    const [pickerTypeFilter, setPickerTypeFilter] = useState<string | null>(null);
    const [pickerColorFilter, setPickerColorFilter] = useState<string | null>(null);
    const [pickerFitFilter, setPickerFitFilter] = useState<string | null>(null);
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    const [tagSearch, setTagSearch] = useState("");
    const [showTagPicker, setShowTagPicker] = useState(false);

    const hasActiveFilters = pickerTypeFilter !== null || pickerColorFilter !== null || pickerFitFilter !== null;

    const filteredArticles = useMemo(() => {
        return allArticles.filter((a) => {
            const matchesSearch =
                !pickerSearch ||
                a.name?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                a.brand?.toLowerCase().includes(pickerSearch.toLowerCase());
            const matchesType = !pickerTypeFilter || a.articleType === pickerTypeFilter;
            const matchesColor = !pickerColorFilter || a.color === pickerColorFilter;
            const matchesFit = !pickerFitFilter || a.fit === pickerFitFilter;
            return matchesSearch && matchesType && matchesColor && matchesFit;
        });
    }, [allArticles, pickerSearch, pickerTypeFilter, pickerColorFilter, pickerFitFilter]);

    const filteredTags = useMemo(() => {
        if (!tagSearch.trim()) return allTags;
        const q = tagSearch.toLowerCase();
        return allTags.filter((t) => t.name.toLowerCase().includes(q));
    }, [allTags, tagSearch]);

    const exactTagMatch = useMemo(() => {
        const q = tagSearch.trim().toLowerCase();
        if (!q) return null;
        return allTags.find((t) => t.name.toLowerCase() === q) ?? null;
    }, [allTags, tagSearch]);

    const getArticleName = (articleId: string) => {
        const article = allArticles.find((a) => a.id === articleId);
        return article?.name ?? article?.articleType ?? null;
    };

    const handleCreateTag = async () => {
        const tag = await createTag(tagSearch);
        if (tag && !selectedTagIds.includes(tag.id)) {
            setSelectedTagIds((prev) => [...prev, tag.id]);
        }
        setTagSearch("");
        setShowTagPicker(false);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: 100, paddingHorizontal: spacing.lg }}
        >
            <Text style={[styles.label, { color: colors.inkSecondary }]}>Outfit Name</Text>
            <TextInput
                style={[styles.input, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.inkPrimary,
                }]}
                value={outfit?.name ?? ""}
                onChangeText={(v: any) =>
                    setOutfit((prev) => (prev ? { ...prev, name: v } : prev))
                }
                placeholder="Name this outfit"
                placeholderTextColor={colors.inkMuted}
            />

            <Text style={[styles.sectionTitle, { color: colors.inkPrimary }]}>Occasion Tags</Text>
            <View style={styles.tagSection}>
                <View style={styles.tagSearchRow}>
                    <TextInput
                        style={[styles.tagSearchInput, {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.inkPrimary,
                        }]}
                        placeholder="Search or add tags..."
                        placeholderTextColor={colors.inkMuted}
                        value={tagSearch}
                        onChangeText={setTagSearch}
                        onFocus={() => setShowTagPicker(true)}
                    />
                    {tagSearch.trim() && !exactTagMatch && (
                        <Pressable style={[styles.addTagButton, { backgroundColor: colors.accent }]} onPress={handleCreateTag}>
                            <Text style={[styles.addTagLabel, { color: colors.surface }]}>+ Add</Text>
                        </Pressable>
                    )}
                </View>
                {showTagPicker && (
                    <View style={[styles.tagDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <ScrollView style={styles.tagDropdownScroll} nestedScrollEnabled>
                            {filteredTags.length > 0 ? (
                                filteredTags.map((tag) => {
                                    const isSelected = selectedTagIds.includes(tag.id);
                                    return (
                                        <Pressable
                                            key={tag.id}
                                            style={[styles.tagItem, { borderBottomColor: colors.border }, isSelected && { backgroundColor: colors.accent + "10" }]}
                                            onPress={() => {
                                                setSelectedTagIds((prev) =>
                                                    isSelected
                                                        ? prev.filter((id) => id !== tag.id)
                                                        : [...prev, tag.id]
                                                );
                                            }}
                                        >
                                            <Text style={[styles.tagItemText, { color: colors.inkPrimary }, isSelected && { color: colors.accent }]}>
                                                {tag.name}
                                            </Text>
                                            {isSelected && <Text style={[styles.tagCheck, { color: colors.accent }]}>✓</Text>}
                                        </Pressable>
                                    );
                                })
                            ) : (
                                <Text style={[styles.tagEmpty, { color: colors.inkMuted }]}>No tags found</Text>
                            )}
                        </ScrollView>
                        <Pressable style={[styles.tagDoneButton, { borderTopColor: colors.border }]} onPress={() => setShowTagPicker(false)}>
                            <Text style={[styles.tagDoneLabel, { color: colors.accent }]}>Done</Text>
                        </Pressable>
                    </View>
                )}
                {selectedTagIds.length > 0 && (
                    <View style={styles.selectedTags}>
                        {selectedTagIds.map((tagId) => {
                            const tag = allTags.find((t) => t.id === tagId);
                            if (!tag) return null;
                            const tagStyle = occasionTagStyles(colors);
                            return (
                                <View key={tagId} style={[tagStyle.container, styles.selectedTagRow]}>
                                    <Text style={tagStyle.label}>{tag.name}</Text>
                                    <Pressable
                                        onPress={() => setSelectedTagIds((prev) => prev.filter((id) => id !== tagId))}
                                    >
                                        <Text style={[styles.selectedTagRemove, { color: colors.accent }]}>×</Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.inkPrimary }]}>Layers</Text>
            {LAYER_TYPES.map((lt) => {
                const oa = outfitArticles.find((o) => o.layerType === lt);
                return (
                    <LayerSlot
                        key={lt}
                        layerType={lt}
                        articleName={oa ? getArticleName(oa.articleId) : null}
                        onPress={() => {
                            setActiveLayer(lt);
                            setPickerSearch("");
                            setPickerTypeFilter(null);
                            setPickerColorFilter(null);
                            setPickerFitFilter(null);
                            setFiltersExpanded(false);
                            setShowArticlePicker(true);
                        }}
                        onRemove={
                            oa ? () => removeArticle(oa.articleId) : undefined
                        }
                    />
                );
            })}

            {showArticlePicker && (
                <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.pickerContent, { backgroundColor: colors.background }]}>
                        <View style={styles.pickerHeader}>
                            <Text style={[styles.pickerTitle, { color: colors.inkPrimary }]}>
                                Select article for {activeLayer}
                            </Text>
                            <Pressable onPress={() => setShowArticlePicker(false)}>
                                <Text style={[styles.cancelLabel, { color: colors.accent }]}>Cancel</Text>
                            </Pressable>
                        </View>

                        <View style={styles.pickerSearchRow}>
                            <TextInput
                                style={[styles.pickerSearchInput, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.inkPrimary,
                                }]}
                                placeholder="Search by name or brand..."
                                placeholderTextColor={colors.inkMuted}
                                value={pickerSearch}
                                onChangeText={setPickerSearch}
                            />
                            <Pressable
                                style={[
                                    styles.pickerFilterButton,
                                    { borderColor: colors.border, backgroundColor: colors.surface },
                                    (filtersExpanded || hasActiveFilters) && { backgroundColor: colors.accent, borderColor: colors.accent },
                                ]}
                                onPress={() => setFiltersExpanded(!filtersExpanded)}
                            >
                                <ListFilter
                                    size={16}
                                    color={
                                        (filtersExpanded || hasActiveFilters)
                                            ? colors.surface
                                            : colors.inkPrimary
                                    }
                                />
                                {hasActiveFilters && <View style={[styles.pickerFilterDot, { backgroundColor: colors.surface }]} />}
                            </Pressable>
                        </View>
                        {filtersExpanded && (
                            <View style={styles.pickerFilterSection}>
                                <FilterChipRow
                                    options={ARTICLE_TYPES}
                                    selectedValue={pickerTypeFilter}
                                    onSelect={(v: string | null) => setPickerTypeFilter(v)}
                                />
                                <FilterChipRow
                                    options={COLOR_OPTIONS}
                                    selectedValue={pickerColorFilter}
                                    onSelect={(v: string | null) => setPickerColorFilter(v)}
                                />
                                <FilterChipRow
                                    options={FIT_OPTIONS}
                                    selectedValue={pickerFitFilter}
                                    onSelect={(v: string | null) => setPickerFitFilter(v)}
                                />
                            </View>
                        )}

                        <ScrollView
                            style={styles.pickerList}
                            nestedScrollEnabled
                        >
                            <View style={styles.pickerListContent}>
                                {filteredArticles.length > 0 ? (
                                    filteredArticles.map((article) => (
                                        <ArticleListItem
                                            key={article.id}
                                            article={article}
                                            onPress={async () => {
                                                await addArticle(article.id, activeLayer);
                                                setShowArticlePicker(false);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Text style={[styles.pickerEmpty, { color: colors.inkMuted }]}>
                                        No articles match your search
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            <Pressable
                style={[styles.saveButton, { backgroundColor: colors.accent }, saving && styles.disabled]}
                onPress={async () => {
                    const result = await save();
                    if (result) router.back();
                }}
                disabled={saving}
            >
                <Text style={[styles.saveLabel, { color: colors.surface }]}>
                    {saving ? "Saving..." : id ? "Update Outfit" : "Save Outfit"}
                </Text>
            </Pressable>

            {id && (
                <Pressable
                    style={[styles.deleteButton, { borderColor: colors.destructive }]}
                    onPress={() => {
                        Alert.alert("Delete", "Remove this outfit?", [
                            { text: "Cancel" },
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: async () => {
                                    await deleteOutfit();
                                    router.back();
                                },
                            },
                        ]);
                    }}
                >
                    <Text style={[styles.deleteLabel, { color: colors.destructive }]}>Delete Outfit</Text>
                </Pressable>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        ...typography.bodySmall,
        fontWeight: "600",
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    sectionTitle: {
        ...typography.h3,
        marginTop: spacing.xxl,
        marginBottom: spacing.md,
    },
    tagSection: {
        marginBottom: spacing.sm,
    },
    tagSearchRow: {
        flexDirection: "row",
        gap: spacing.sm,
        alignItems: "center",
    },
    tagSearchInput: {
        ...typography.body,
        flex: 1,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    addTagButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
    },
    addTagLabel: {
        ...typography.buttonSmall,
    },
    tagDropdown: {
        marginTop: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        maxHeight: 200,
    },
    tagDropdownScroll: {
        maxHeight: 160,
    },
    tagItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.sm,
        borderBottomWidth: 1,
    },
    tagItemText: {
        ...typography.body,
    },
    tagCheck: {
        ...typography.body,
    },
    tagEmpty: {
        ...typography.body,
        textAlign: "center",
        padding: spacing.lg,
    },
    tagDoneButton: {
        padding: spacing.sm,
        alignItems: "center",
        borderTopWidth: 1,
    },
    tagDoneLabel: {
        ...typography.buttonSmall,
    },
    selectedTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
        marginTop: spacing.sm,
    },
    selectedTagRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    selectedTagRemove: {
        ...typography.caption,
        marginLeft: spacing.xs,
    },
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
        zIndex: 100,
    },
    pickerContent: {
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        height: "85%",
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.lg,
        paddingBottom: 0,
    },
    pickerTitle: {
        ...typography.h3,
        textTransform: "capitalize",
    },
    cancelLabel: {
        ...typography.buttonSmall,
        color: '#B9705F',
    },
    pickerList: {
        flex: 1,
    },
    pickerListContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
    pickerSearchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    pickerSearchInput: {
        ...typography.body,
        flex: 1,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    pickerFilterButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    pickerFilterDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: spacing.xs,
    },
    pickerFilterSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    pickerEmpty: {
        ...typography.body,
        textAlign: "center",
        marginTop: spacing.xxl,
    },
    saveButton: {
        marginTop: spacing.xxl,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        alignItems: "center",
    },
    disabled: {
        opacity: 0.6,
    },
    saveLabel: {
        ...typography.button,
    },
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
    },
    deleteLabel: {
        ...typography.button,
    },
});
