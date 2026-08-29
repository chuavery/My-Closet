import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useOutfitBuilder } from "@/viewmodels/useOutfitBuilder";
import { LayerType } from "@/models/OutfitArticle";
import { LayerSlot } from "@/components/LayerSlot";
import { OccasionTagPicker } from "@/components/OccasionTagPicker";
import { ArticleCard } from "@/components/ArticleCard";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

const LAYER_TYPES: LayerType[] = [
    "base",
    "mid",
    "outer",
    "bottom",
    "footwear",
    "accessory",
];

export default function OutfitBuilderScreen() {
    const router = useRouter();
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
        save,
        saving,
    } = useOutfitBuilder();

    const [showArticlePicker, setShowArticlePicker] = useState(false);
    const [activeLayer, setActiveLayer] = useState<LayerType>("base");

    const getArticleName = (articleId: string) => {
        const article = allArticles.find((a) => a.id === articleId);
        return article?.name ?? article?.articleType ?? null;
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
                    <Text style={styles.pickerTitle}>
                        Select article for {activeLayer}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.pickerList}
                    >
                        {allArticles.map((article) => (
                            <Pressable
                                key={article.id}
                                onPress={async () => {
                                    await addArticle(article.id, activeLayer);
                                    setShowArticlePicker(false);
                                }}
                            >
                                <ArticleCard article={article} />
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Pressable
                        style={styles.cancelButton}
                        onPress={() => setShowArticlePicker(false)}
                    >
                        <Text style={styles.cancelLabel}>Cancel</Text>
                    </Pressable>
                </View>
            )}

            <Text style={styles.sectionTitle}>Occasion Tags</Text>
            <OccasionTagPicker
                tags={allTags}
                selectedTagIds={selectedTagIds}
                onToggle={(tagId: string) => {
                    setSelectedTagIds((prev) =>
                        prev.includes(tagId)
                            ? prev.filter((id) => id !== tagId)
                            : [...prev, tagId]
                    );
                }}
            />

            <Pressable
                style={[styles.saveButton, saving && styles.disabled]}
                onPress={async () => {
                    const result = await save();
                    if (result) router.back();
                }}
                disabled={saving}
            >
                <Text style={styles.saveLabel}>
                    {saving ? "Saving..." : "Save Outfit"}
                </Text>
            </Pressable>
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
        padding: spacing.md,
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
    pickerOverlay: {
        marginTop: spacing.lg,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pickerTitle: {
        ...typography.bodySmall,
        color: colors.inkLight,
        fontWeight: "600",
        marginBottom: spacing.sm,
        textTransform: "capitalize",
    },
    pickerList: {
        gap: spacing.sm,
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
    saveButton: {
        marginTop: spacing.xxl,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
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
});
