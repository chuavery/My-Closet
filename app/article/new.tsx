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
import { Camera, Image as ImageIcon } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeContext";
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
    const { colors } = useTheme();
    const { form, updateField, pickImage, takePhoto, save, saving } = useArticleForm();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <Text style={[styles.hint, { color: colors.inkSecondary }]}>A photo is required for every article.</Text>
            {form.originalImageUrl ? (
                <View style={styles.imagePreview}>
                    <Image
                        source={{ uri: form.originalImageUrl }}
                        style={styles.previewImage}
                    />
                    <Pressable style={styles.changePhotoButton} onPress={pickImage}>
                        <Text style={[styles.changePhotoLabel, { color: colors.accent }]}>Change Photo</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.photoButtons}>
                    <Pressable style={[styles.photoButton, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={takePhoto}>
                        <Camera size={24} color={colors.inkPrimary} />
                        <Text style={[styles.photoButtonLabel, { color: colors.inkPrimary }]}>Take Photo</Text>
                    </Pressable>
                    <Pressable style={[styles.photoButton, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={pickImage}>
                        <ImageIcon size={24} color={colors.inkPrimary} />
                        <Text style={[styles.photoButtonLabel, { color: colors.inkPrimary }]}>Choose from Library</Text>
                    </Pressable>
                </View>
            )}

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Name</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.inkPrimary }]}
                value={form.name}
                onChangeText={(v: string) => updateField("name", v)}
                placeholder="Article name"
                placeholderTextColor={colors.inkMuted}
            />

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Brand</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.inkPrimary }]}
                value={form.brand}
                onChangeText={(v: string) => updateField("brand", v)}
                placeholder="Brand"
                placeholderTextColor={colors.inkMuted}
            />

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Type</Text>
            <View style={styles.chipRow}>
                {ARTICLE_TYPES.map((t) => (
                    <Pressable
                        key={t}
                        style={[
                            styles.chip,
                            { borderColor: colors.border, backgroundColor: colors.surface },
                            form.articleType === t && { backgroundColor: colors.accent, borderColor: colors.accent },
                        ]}
                        onPress={() => updateField("articleType", t)}
                    >
                        <Text style={[
                            styles.chipLabel,
                            { color: colors.inkPrimary },
                            form.articleType === t && { color: colors.surface },
                        ]}>
                            {capitalize(t)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Color</Text>
            <View style={styles.chipRow}>
                {COLOR_OPTIONS.map((c) => (
                    <Pressable
                        key={c}
                        style={[
                            styles.chip,
                            { borderColor: colors.border, backgroundColor: colors.surface },
                            form.color === c && { backgroundColor: colors.accent, borderColor: colors.accent },
                        ]}
                        onPress={() => updateField("color", c)}
                    >
                        <Text style={[
                            styles.chipLabel,
                            { color: colors.inkPrimary },
                            form.color === c && { color: colors.surface },
                        ]}>
                            {capitalize(c)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Fit</Text>
            <View style={styles.chipRow}>
                {FIT_OPTIONS.map((f) => (
                    <Pressable
                        key={f}
                        style={[
                            styles.chip,
                            { borderColor: colors.border, backgroundColor: colors.surface },
                            form.fit === f && { backgroundColor: colors.accent, borderColor: colors.accent },
                        ]}
                        onPress={() => updateField("fit", f)}
                    >
                        <Text style={[
                            styles.chipLabel,
                            { color: colors.inkPrimary },
                            form.fit === f && { color: colors.surface },
                        ]}>
                            {capitalize(f)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Details</Text>
            <View style={styles.detailsRow}>
                <View style={styles.detailField}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.inkPrimary }]}
                        value={form.size}
                        onChangeText={(v: string) => updateField("size", v)}
                        placeholder="Size"
                        placeholderTextColor={colors.inkMuted}
                    />
                </View>
                <View style={styles.detailField}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.inkPrimary }]}
                        value={form.fabricType}
                        onChangeText={(v: string) => updateField("fabricType", v)}
                        placeholder="Fabric"
                        placeholderTextColor={colors.inkMuted}
                    />
                </View>
            </View>

            <Pressable
                style={[styles.saveButton, { backgroundColor: colors.accent }, saving && styles.disabled]}
                onPress={async () => {
                    const result = await save();
                    if (result) router.back();
                }}
                disabled={saving}
            >
                <Text style={[styles.saveLabel, { color: colors.surface }]}>
                    {saving ? "Adding..." : "Add Article"}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    label: {
        ...typography.bodySmall,
        fontWeight: "600",
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    hint: {
        ...typography.caption,
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
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderStyle: "dashed",
    },
    photoButtonLabel: {
        ...typography.bodySmall,
        textAlign: "center",
    },
    imagePreview: {
        alignItems: "center",
    },
    previewImage: {
        width: "100%",
        aspectRatio: 3 / 4,
        borderRadius: borderRadius.md,
    },
    changePhotoButton: {
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    changePhotoLabel: {
        ...typography.bodySmall,
        fontWeight: "600",
    },
    input: {
        ...typography.body,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
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
    },
    chipLabel: {
        ...typography.buttonSmall,
        textTransform: "capitalize",
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
});
