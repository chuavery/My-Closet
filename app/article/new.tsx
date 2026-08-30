import React from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useArticleForm } from "@/viewmodels/useArticleForm";
import { ArticleType, Color, Fit } from "@/models/Article";
import { capitalize } from "@/lib/capitalize";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

const ARTICLE_TYPES: ArticleType[] = [
    "shirt", "jacket", "dress", "pants", "shorts",
    "skirt", "sweater", "coat", "shoes", "accessories", "other",
];

const COLOR_OPTIONS: Color[] = [
    "red", "orange", "yellow", "green", "blue",
    "indigo", "violet", "pink", "white", "brown", "black",
];

const FIT_OPTIONS: Fit[] = [
    "slim", "regular", "straight", "oversized", "relaxed", "tailored",
];

export default function NewArticleScreen() {
    const router = useRouter();
    const { form, updateField, pickImage, takePhoto, save, saving } = useArticleForm();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.label}>Photo</Text>
            <Text style={styles.hint}>A photo is required for every article.</Text>
            {form.originalImageUrl ? (
                <View style={styles.imagePreview}>
                    <Image
                        source={{ uri: form.originalImageUrl }}
                        style={styles.previewImage}
                    />
                    <Pressable style={styles.changePhotoButton} onPress={pickImage}>
                        <Text style={styles.changePhotoLabel}>Change Photo</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.photoButtons}>
                    <Pressable style={styles.photoButton} onPress={takePhoto}>
                        <Text style={styles.photoButtonIcon}>📷</Text>
                        <Text style={styles.photoButtonLabel}>Take Photo</Text>
                    </Pressable>
                    <Pressable style={styles.photoButton} onPress={pickImage}>
                        <Text style={styles.photoButtonIcon}>🖼️</Text>
                        <Text style={styles.photoButtonLabel}>Choose from Library</Text>
                    </Pressable>
                </View>
            )}

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
                        style={[styles.chip, form.articleType === t && styles.chipSelected]}
                        onPress={() => updateField("articleType", t)}
                    >
                        <Text style={[styles.chipLabel, form.articleType === t && styles.chipLabelSelected]}>
                            {capitalize(t)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.chipRow}>
                {COLOR_OPTIONS.map((c) => (
                    <Pressable
                        key={c}
                        style={[styles.chip, form.color === c && styles.chipSelected]}
                        onPress={() => updateField("color", c)}
                    >
                        <Text style={[styles.chipLabel, form.color === c && styles.chipLabelSelected]}>
                            {capitalize(c)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Fit</Text>
            <View style={styles.chipRow}>
                {FIT_OPTIONS.map((f) => (
                    <Pressable
                        key={f}
                        style={[styles.chip, form.fit === f && styles.chipSelected]}
                        onPress={() => updateField("fit", f)}
                    >
                        <Text style={[styles.chipLabel, form.fit === f && styles.chipLabelSelected]}>
                            {capitalize(f)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Details</Text>
            <View style={styles.detailsRow}>
                <View style={styles.detailField}>
                    <TextInput
                        style={styles.input}
                        value={form.size}
                        onChangeText={(v: string) => updateField("size", v)}
                        placeholder="Size"
                        placeholderTextColor={colors.inkLight}
                    />
                </View>
                <View style={styles.detailField}>
                    <TextInput
                        style={styles.input}
                        value={form.fabricType}
                        onChangeText={(v: string) => updateField("fabricType", v)}
                        placeholder="Fabric"
                        placeholderTextColor={colors.inkLight}
                    />
                </View>
            </View>

            <Pressable
                style={[styles.saveButton, saving && styles.disabled]}
                onPress={async () => {
                    const result = await save();
                    if (result) router.back();
                }}
                disabled={saving}
            >
                <Text style={styles.saveLabel}>
                    {saving ? "Adding..." : "Add Article"}
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
        marginTop: spacing.md,
    },
    hint: {
        ...typography.caption,
        color: colors.inkLight,
        marginBottom: spacing.sm,
    },
    photoButtons: {
        flexDirection: "row",
        gap: spacing.md,
    },
    photoButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: "dashed",
    },
    photoButtonIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    photoButtonLabel: {
        ...typography.bodySmall,
        color: colors.ink,
        textAlign: "center",
    },
    imagePreview: {
        alignItems: "center",
    },
    previewImage: {
        width: "100%",
        aspectRatio: 3 / 4,
        borderRadius: borderRadius.md,
        backgroundColor: colors.paperDark,
    },
    changePhotoButton: {
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    changePhotoLabel: {
        ...typography.bodySmall,
        color: colors.accent,
        fontWeight: "600",
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
    detailsRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    detailField: {
        flex: 1,
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
});
