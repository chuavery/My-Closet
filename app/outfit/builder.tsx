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
import { useOutfitBuilder } from "@/viewmodels/useOutfitBuilder";
import { LayerType } from "@/models/OutfitArticle";
import { LayerSlot } from "@/components/LayerSlot";
import { ArticleListItem } from "@/components/ArticleListItem";
import { FilterChipRow } from "@/components/FilterChipRow";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
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
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.label}>Outfit Name</Text>
            <TextInput
                style={styles.input}
                value={outfit?.name ?? ""}
                onChangeText={(v: any) =>
                    setOutfit((prev) => (prev ? { ...prev, name: v } : prev))
                }
                placeholder="Name this outfit"
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.sectionTitle}>Occasion Tags</Text>
            <View style={styles.tagSection}>
                <View style={styles.tagSearchRow}>
                    <TextInput
                        style={styles.tagSearchInput}
                        placeholder="Search or add tags..."
                        placeholderTextColor={colors.inkLight}
                        value={tagSearch}
                        onChangeText={setTagSearch}
                        onFocus={() => setShowTagPicker(true)}
                    />
                    {tagSearch.trim() && !exactTagMatch && (
                        <Pressable style={styles.addTagButton} onPress={handleCreateTag}>
                            <Text style={styles.addTagLabel}>+ Add</Text>
                        </Pressable>
                    )}
                </View>
                {showTagPicker && (
                    <View style={styles.tagDropdown}>
                        <ScrollView style={styles.tagDropdownScroll} nestedScrollEnabled>
                            {filteredTags.length > 0 ? (
                                filteredTags.map((tag) => {
                                    const isSelected = selectedTagIds.includes(tag.id);
                                    return (
                                        <Pressable
                                            key={tag.id}
                                            style={[styles.tagItem, isSelected && styles.tagItemSelected]}
                                            onPress={() => {
                                                setSelectedTagIds((prev) =>
                                                    isSelected
                                                        ? prev.filter((id) => id !== tag.id)
                                                        : [...prev, tag.id]
                                                );
                                            }}
                                        >
                                            <Text style={[styles.tagItemText, isSelected && styles.tagItemTextSelected]}>
                                                {tag.name}
                                            </Text>
                                            {isSelected && <Text style={styles.tagCheck}>✓</Text>}
                                        </Pressable>
                                    );
                                })
                            ) : (
                                <Text style={styles.tagEmpty}>No tags found</Text>
                            )}
                        </ScrollView>
                        <Pressable style={styles.tagDoneButton} onPress={() => setShowTagPicker(false)}>
                            <Text style={styles.tagDoneLabel}>Done</Text>
                        </Pressable>
                    </View>
                )}
                {selectedTagIds.length > 0 && (
                    <View style={styles.selectedTags}>
                        {selectedTagIds.map((tagId) => {
                            const tag = allTags.find((t) => t.id === tagId);
                            if (!tag) return null;
                            return (
                                <View key={tagId} style={styles.selectedTag}>
                                    <Text style={styles.selectedTagText}>{tag.name}</Text>
                                    <Pressable
                                        onPress={() => setSelectedTagIds((prev) => prev.filter((id) => id !== tagId))}
                                    >
                                        <Text style={styles.selectedTagRemove}>×</Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            <Text style={styles.sectionTitle}>Layers</Text>
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
                <View style={styles.pickerOverlay}>
                    <View style={styles.pickerContent}>
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>
                                Select article for {activeLayer}
                            </Text>
                            <Pressable onPress={() => setShowArticlePicker(false)}>
                                <Text style={styles.cancelLabel}>Cancel</Text>
                            </Pressable>
                        </View>

                        <View style={styles.pickerSearchRow}>
                            <TextInput
                                style={styles.pickerSearchInput}
                                placeholder="Search by name or brand..."
                                placeholderTextColor={colors.inkLight}
                                value={pickerSearch}
                                onChangeText={setPickerSearch}
                            />
                            <Pressable
                                style={[
                                    styles.pickerFilterButton,
                                    (filtersExpanded || hasActiveFilters) && styles.pickerFilterButtonActive,
                                ]}
                                onPress={() => setFiltersExpanded(!filtersExpanded)}
                            >
                                <ListFilter
                                    size={16}
                                    color={
                                        (filtersExpanded || hasActiveFilters)
                                            ? colors.white
                                            : colors.ink
                                    }
                                />
                                {hasActiveFilters && <View style={styles.pickerFilterDot} />}
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
                                    <Text style={styles.pickerEmpty}>
                                        No articles match your search
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            <Pressable
                style={[styles.saveButton, saving && styles.disabled]}
                onPress={async () => {
                    const result = await save();
                    if (result) router.back();
                }}
                disabled={saving}
            >
                <Text style={styles.saveLabel}>
                    {saving ? "Saving..." : id ? "Update Outfit" : "Save Outfit"}
                </Text>
            </Pressable>

            {id && (
                <Pressable
                    style={styles.deleteButton}
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
                    <Text style={styles.deleteLabel}>Delete Outfit</Text>
                </Pressable>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.paper,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    label: {
        ...typography.bodySmall,
        color: colors.inkLight,
        fontWeight: "600",
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        padding: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.ink,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.ink,
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
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.ink,
    },
    addTagButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.accent,
        borderRadius: 8,
    },
    addTagLabel: {
        ...typography.buttonSmall,
        color: colors.white,
    },
    tagDropdown: {
        marginTop: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
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
        borderBottomColor: colors.border,
    },
    tagItemSelected: {
        backgroundColor: colors.accent + "10",
    },
    tagItemText: {
        ...typography.body,
        color: colors.ink,
    },
    tagItemTextSelected: {
        color: colors.accent,
        fontWeight: "600",
    },
    tagCheck: {
        ...typography.body,
        color: colors.accent,
    },
    tagEmpty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        padding: spacing.lg,
    },
    tagDoneButton: {
        padding: spacing.sm,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    tagDoneLabel: {
        ...typography.buttonSmall,
        color: colors.accent,
    },
    selectedTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
        marginTop: spacing.sm,
    },
    selectedTag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        backgroundColor: colors.accent + "20",
    },
    selectedTagText: {
        ...typography.caption,
        color: colors.accent,
    },
    selectedTagRemove: {
        ...typography.caption,
        color: colors.accent,
        marginLeft: spacing.xs,
    },
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
        zIndex: 100,
    },
    pickerContent: {
        backgroundColor: colors.paper,
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
        color: colors.ink,
        textTransform: "capitalize",
    },
    cancelLabel: {
        ...typography.buttonSmall,
        color: colors.accent,
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
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.ink,
    },
    pickerFilterButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        flexDirection: "row",
        alignItems: "center",
    },
    pickerFilterButtonActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    pickerFilterLabel: {
        ...typography.buttonSmall,
        color: colors.ink,
    },
    pickerFilterLabelActive: {
        color: colors.white,
    },
    pickerFilterDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
        marginLeft: spacing.xs,
    },
    pickerFilterSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    pickerEmpty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        marginTop: spacing.xxl,
    },
    saveButton: {
        marginTop: spacing.xxl,
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        alignItems: "center",
    },
    disabled: {
        opacity: 0.6,
    },
    saveLabel: {
        ...typography.button,
        color: colors.white,
    },
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
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
