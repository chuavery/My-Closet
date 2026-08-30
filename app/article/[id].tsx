import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Pressable,
    Image,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { useArticleForm } from "@/viewmodels/useArticleForm";
import { useRepositories } from "@/providers/RepositoryProvider";
import { ArticleType, Color } from "@/models/Article";
import { StorageSpace } from "@/models/StorageSpace";
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

export default function ArticleDetailScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { form, updateField, pickImage, takePhoto, save, remove, loading, saving, isNew } =
        useArticleForm(id);

    const { storageSpaceRepository } = useRepositories();
    const [spaces, setSpaces] = useState<StorageSpace[]>([]);
    const [editing, setEditing] = useState(isNew);
    const [showSpacePicker, setShowSpacePicker] = useState(false);

    useEffect(() => {
        storageSpaceRepository.getAll().then(setSpaces);
    }, [storageSpaceRepository]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (isNew) return null;
                return (
                    <Pressable onPress={() => setEditing(!editing)}>
                        <Text style={styles.headerButton}>
                            {editing ? "Cancel" : "Edit"}
                        </Text>
                    </Pressable>
                );
            },
        });
    }, [navigation, editing, isNew]);

    const selectedSpace = spaces.find((s) => s.id === form.storageSpaceId);

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
            <Text style={styles.label}>Photo</Text>
            {form.originalImageUrl ? (
                <View style={styles.imagePreview}>
                    <Image
                        source={{ uri: form.originalImageUrl }}
                        style={styles.previewImage}
                    />
                    {editing && (
                        <Pressable style={styles.changePhotoButton} onPress={pickImage}>
                            <Text style={styles.changePhotoLabel}>Change Photo</Text>
                        </Pressable>
                    )}
                </View>
            ) : editing ? (
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
            ) : (
                <Text style={styles.emptyValue}>No photo</Text>
            )}

            <Text style={styles.label}>Name</Text>
            {editing ? (
                <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={(v: string) => updateField("name", v)}
                    placeholder="Article name"
                    placeholderTextColor={colors.inkLight}
                />
            ) : (
                <Text style={styles.value}>{form.name || "—"}</Text>
            )}

            <Text style={styles.label}>Brand</Text>
            {editing ? (
                <TextInput
                    style={styles.input}
                    value={form.brand}
                    onChangeText={(v: string) => updateField("brand", v)}
                    placeholder="Brand"
                    placeholderTextColor={colors.inkLight}
                />
            ) : (
                <Text style={styles.value}>{form.brand || "—"}</Text>
            )}

            <Text style={styles.label}>Type</Text>
            {editing ? (
                <View style={styles.chipRow}>
                    {ARTICLE_TYPES.map((t) => (
                        <Pressable
                            key={t}
                            style={[styles.chip, form.articleType === t && styles.chipSelected]}
                            onPress={() => updateField("articleType", t)}
                        >
                            <Text
                                style={[styles.chipLabel, form.articleType === t && styles.chipLabelSelected]}
                            >
                                {t}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ) : (
                <Text style={styles.value}>{form.articleType}</Text>
            )}

            <Text style={styles.label}>Color</Text>
            {editing ? (
                <View style={styles.chipRow}>
                    {COLOR_OPTIONS.map((c) => (
                        <Pressable
                            key={c}
                            style={[styles.chip, form.color === c && styles.chipSelected]}
                            onPress={() => updateField("color", c)}
                        >
                            <Text
                                style={[styles.chipLabel, form.color === c && styles.chipLabelSelected]}
                            >
                                {c}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ) : (
                <Text style={styles.value}>{form.color}</Text>
            )}

            <Text style={styles.label}>Size</Text>
            {editing ? (
                <TextInput
                    style={styles.input}
                    value={form.size}
                    onChangeText={(v: string) => updateField("size", v)}
                    placeholder="Size"
                    placeholderTextColor={colors.inkLight}
                />
            ) : (
                <Text style={styles.value}>{form.size || "—"}</Text>
            )}

            <Text style={styles.label}>Fit</Text>
            {editing ? (
                <TextInput
                    style={styles.input}
                    value={form.fit}
                    onChangeText={(v: string) => updateField("fit", v)}
                    placeholder="Fit (e.g. slim, regular)"
                    placeholderTextColor={colors.inkLight}
                />
            ) : (
                <Text style={styles.value}>{form.fit || "—"}</Text>
            )}

            <Text style={styles.label}>Fabric</Text>
            {editing ? (
                <TextInput
                    style={styles.input}
                    value={form.fabricType}
                    onChangeText={(v: string) => updateField("fabricType", v)}
                    placeholder="Fabric type"
                    placeholderTextColor={colors.inkLight}
                />
            ) : (
                <Text style={styles.value}>{form.fabricType || "—"}</Text>
            )}

            <Text style={styles.label}>Storage Space</Text>
            {editing ? (
                <Pressable
                    style={styles.dropdown}
                    onPress={() => setShowSpacePicker(true)}
                >
                    <Text style={[styles.dropdownText, !selectedSpace && styles.dropdownPlaceholder]}>
                        {selectedSpace?.name ?? "Unassigned"}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                </Pressable>
            ) : (
                <Text style={styles.value}>{selectedSpace?.name ?? "Unassigned"}</Text>
            )}

            {editing && (
                <>
                    <Pressable
                        style={[styles.saveButton, saving && styles.disabled]}
                        onPress={async () => {
                            const result = await save();
                            if (result) {
                                setEditing(false);
                                router.back();
                            }
                        }}
                        disabled={saving}
                    >
                        <Text style={styles.saveLabel}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Text>
                    </Pressable>

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
                </>
            )}

            {showSpacePicker && (
                <View style={styles.pickerOverlay}>
                    <View style={styles.pickerContent}>
                        <Text style={styles.pickerTitle}>Select Storage Space</Text>
                        <Pressable
                            style={[styles.pickerItem, !form.storageSpaceId && styles.pickerItemSelected]}
                            onPress={() => {
                                updateField("storageSpaceId", null);
                                setShowSpacePicker(false);
                            }}
                        >
                            <Text style={[styles.pickerItemText, !form.storageSpaceId && styles.pickerItemTextSelected]}>
                                Unassigned
                            </Text>
                        </Pressable>
                        {spaces.map((space) => (
                            <Pressable
                                key={space.id}
                                style={[styles.pickerItem, form.storageSpaceId === space.id && styles.pickerItemSelected]}
                                onPress={() => {
                                    updateField("storageSpaceId", space.id);
                                    setShowSpacePicker(false);
                                }}
                            >
                                <Text style={[styles.pickerItemText, form.storageSpaceId === space.id && styles.pickerItemTextSelected]}>
                                    {space.name}
                                    {space.subLocation ? ` — ${space.subLocation}` : ""}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setShowSpacePicker(false)}
                        >
                            <Text style={styles.cancelLabel}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
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
    headerButton: {
        ...typography.buttonSmall,
        color: colors.accent,
    },
    label: {
        ...typography.bodySmall,
        color: colors.inkLight,
        fontWeight: "600",
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    value: {
        ...typography.body,
        color: colors.ink,
    },
    emptyValue: {
        ...typography.body,
        color: colors.border,
        fontStyle: "italic",
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
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dropdownText: {
        ...typography.body,
        color: colors.ink,
    },
    dropdownPlaceholder: {
        color: colors.inkLight,
    },
    dropdownArrow: {
        ...typography.caption,
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
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        alignItems: "center",
    },
    deleteLabel: {
        ...typography.button,
        color: colors.error,
    },
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    pickerContent: {
        backgroundColor: colors.paper,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        maxHeight: "70%",
        padding: spacing.lg,
    },
    pickerTitle: {
        ...typography.h3,
        color: colors.ink,
        marginBottom: spacing.md,
    },
    pickerItem: {
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.xs,
    },
    pickerItemSelected: {
        backgroundColor: colors.accent + "20",
    },
    pickerItemText: {
        ...typography.body,
        color: colors.ink,
    },
    pickerItemTextSelected: {
        color: colors.accent,
        fontWeight: "600",
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
});
