import React from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Pressable
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useArticleForm } from "@/viewmodels/useArticleForm";
import { ArticleType, Color } from "@/models/Article";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

const ARTICLE_TYPES: ArticleType[] = [
    "shirt",
    "jacket",
    "dress",
    "pants",
    "shorts",
    "skirt",
    "sweater",
    "coat",
    "shoes",
    "accessories",
    "other",
];

const COLOR_OPTIONS: Color[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
    "pink",
    "white",
    "brown",
    "black",
];

export default function ArticleDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { form, updateField, save, remove, loading, saving, isNew } =
        useArticleForm(id);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v: string) => updateField("name", v)}
                placeholder="Article name"
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>Brand</Text>
            <TextInput
                style={styles.input}
                value={form.brand}
                onChangeText={(v: string) => updateField("brand", v)}
                placeholder="Brand"
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.chipRow}>
                {ARTICLE_TYPES.map((t) => (
                    <Pressable
                        key={t}
                        style={[
                            styles.chip,
                            form.articleType === t && styles.chipSelected,
                        ]}
                        onPress={() => updateField("articleType", t)}
                    >
                        <Text
                            style={[
                                styles.chipLabel,
                                form.articleType === t &&
                                    styles.chipLabelSelected,
                            ]}
                        >
                            {t}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.chipRow}>
                {COLOR_OPTIONS.map((c) => (
                    <Pressable
                        key={c}
                        style={[
                            styles.chip,
                            form.color === c && styles.chipSelected,
                        ]}
                        onPress={() => updateField("color", c)}
                    >
                        <Text
                            style={[
                                styles.chipLabel,
                                form.color === c && styles.chipLabelSelected,
                            ]}
                        >
                            {c}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Size</Text>
            <TextInput
                style={styles.input}
                value={form.size}
                onChangeText={(v: string) => updateField("size", v)}
                placeholder="Size"
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>Fit</Text>
            <TextInput
                style={styles.input}
                value={form.fit}
                onChangeText={(v: string) => updateField("fit", v)}
                placeholder="Fit (e.g. slim, regular)"
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>Fabric</Text>
            <TextInput
                style={styles.input}
                value={form.fabricType}
                onChangeText={(v: string) => updateField("fabricType", v)}
                placeholder="Fabric type"
                placeholderTextColor={colors.inkLight}
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
                    {saving
                        ? "Saving..."
                        : isNew
                        ? "Add Article"
                        : "Save Changes"}
                </Text>
            </Pressable>

            {!isNew && (
                <Pressable
                    style={styles.deleteButton}
                    onPress={() => {
                        Alert.alert("Delete", "Remove this article?", [
                            { text: "Cancel" },
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: async () => {
                                    await remove();
                                    router.back();
                                },
                            },
                        ]);
                    }}
                >
                    <Text style={styles.deleteLabel}>Delete Article</Text>
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        marginTop: spacing.md,
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
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
    },
    chipSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    chipLabel: {
        ...typography.buttonSmall,
        color: colors.ink,
        textTransform: "capitalize",
    },
    chipLabelSelected: {
        color: colors.white,
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
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        alignItems: "center",
    },
    deleteLabel: {
        ...typography.button,
        color: colors.error,
    },
});
