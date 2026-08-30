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
import { useSettings } from "@/viewmodels/useSettings";
import { useTheme } from "@/providers/ThemeContext";
import { ArticleType, Color, Fit } from "@/models/Article";
import { capitalize } from "@/lib/capitalize";
import { StorageSpace } from "@/models/StorageSpace";
import { colors as lightColors } from "@/theme/colors";
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

const COLOR_MAP: Record<string, string> = {
    red: '#C45B3E',
    orange: '#E88A4A',
    yellow: '#E8C84A',
    green: '#5A8F6A',
    blue: '#4A7AE8',
    indigo: '#5A4AE8',
    violet: '#8A4AE8',
    pink: '#E87AB0',
    white: '#F0EDE6',
    brown: '#8B6F47',
    black: '#2C2C2C',
};

export default function ArticleDetailScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { form, updateField, pickImage, takePhoto, save, remove, loading, saving, isNew, wearCount, lastWornAt } =
        useArticleForm(id);

    const { storageSpaceRepository } = useRepositories();
    const { settings } = useSettings();
    const { colors, isDark } = useTheme();
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

    useEffect(() => {
        navigation.setOptions({ title: form.name || "Article" });
    }, [navigation, form.name]);

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
            style={[styles.container, { backgroundColor: colors.paper }]}
            contentContainerStyle={styles.content}
        >
            <Text style={[styles.label, { color: colors.inkLight }]}>Photo</Text>
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

            <View style={styles.tags}>
                <View style={[styles.tag, { backgroundColor: colors.accent + "20" }]}>
                    <Text style={[styles.tagLabel, { color: colors.accent }]}>{capitalize(form.articleType)}</Text>
                </View>
                <View style={[
                    styles.tag,
                    {
                        backgroundColor: form.color === 'white' && !isDark
                            ? 'transparent'
                            : (COLOR_MAP[form.color] ?? colors.accent) + "20",
                        ...(form.color === 'white' && !isDark ? { borderWidth: 1, borderColor: colors.border } : {}),
                    },
                ]}>
                    <Text style={[
                        styles.tagLabel,
                        {
                            color: form.color === 'white' && !isDark
                                ? colors.ink
                                : COLOR_MAP[form.color] ?? colors.accent,
                        },
                    ]}>{capitalize(form.color)}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.accent + "20" }]}>
                    <Text style={[styles.tagLabel, { color: colors.accent }]}>{capitalize(form.fit)}</Text>
                </View>
            </View>

            <Text style={[styles.label, { color: colors.inkLight }]}>Name</Text>
            <Text style={[styles.value, { color: colors.ink }]}>{form.name || "—"}</Text>

            <Text style={[styles.label, { color: colors.inkLight }]}>Brand</Text>
            <Text style={[styles.value, { color: colors.ink }]}>{form.brand || "—"}</Text>

            <Text style={[styles.label, { color: colors.inkLight }]}>Size</Text>
            <Text style={[styles.value, { color: colors.ink }]}>{form.size || "—"}</Text>

            <Text style={[styles.label, { color: colors.inkLight }]}>Fabric</Text>
            <Text style={[styles.value, { color: colors.ink }]}>{form.fabricType || "—"}</Text>

            {settings.wearHistoryEnabled && (
                <>
                    <Text style={[styles.label, { color: colors.inkLight }]}>Wear Count</Text>
                    <Text style={[styles.value, { color: colors.ink }]}>{wearCount}</Text>

                    <Text style={[styles.label, { color: colors.inkLight }]}>Last Worn</Text>
                    <Text style={[styles.value, { color: colors.ink }]}>
                        {lastWornAt
                            ? new Date(lastWornAt).toLocaleDateString()
                            : "—"}
                    </Text>
                </>
            )}

            <Text style={[styles.label, { color: colors.inkLight }]}>Storage Space</Text>
            {editing ? (
                <Pressable
                    style={[styles.dropdown, { backgroundColor: colors.white, borderColor: colors.border }]}
                    onPress={() => setShowSpacePicker(true)}
                >
                    <Text style={[styles.dropdownText, { color: colors.ink }, !selectedSpace && { color: colors.inkLight }]}>
                        {selectedSpace?.name ?? "Unassigned"}
                    </Text>
                    <Text style={[styles.dropdownArrow, { color: colors.inkLight }]}>▼</Text>
                </Pressable>
            ) : (
                <Text style={[styles.value, { color: colors.ink }]}>{selectedSpace?.name ?? "Unassigned"}</Text>
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
        backgroundColor: lightColors.paper,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: lightColors.paper,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    headerButton: {
        ...typography.buttonSmall,
        color: lightColors.accent,
    },
    label: {
        ...typography.bodySmall,
        color: lightColors.inkLight,
        fontWeight: "600",
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    value: {
        ...typography.body,
        color: lightColors.ink,
    },
    emptyValue: {
        ...typography.body,
        color: lightColors.border,
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
        backgroundColor: lightColors.white,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: lightColors.border,
        borderStyle: "dashed",
    },
    photoButtonIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    photoButtonLabel: {
        ...typography.bodySmall,
        color: lightColors.ink,
        textAlign: "center",
    },
    imagePreview: {
        alignItems: "center",
    },
    previewImage: {
        width: "100%",
        aspectRatio: 3 / 4,
        borderRadius: borderRadius.md,
        backgroundColor: lightColors.paperDark,
    },
    changePhotoButton: {
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    changePhotoLabel: {
        ...typography.bodySmall,
        color: lightColors.accent,
        fontWeight: "600",
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    tag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        backgroundColor: lightColors.accent + "20",
    },
    tagLabel: {
        ...typography.caption,
        color: lightColors.accent,
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.sm,
        backgroundColor: lightColors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: lightColors.border,
    },
    dropdownText: {
        ...typography.body,
        color: lightColors.ink,
    },
    dropdownPlaceholder: {
        color: lightColors.inkLight,
    },
    dropdownArrow: {
        ...typography.caption,
        color: lightColors.inkLight,
    },
    saveButton: {
        marginTop: spacing.xxl,
        backgroundColor: lightColors.accent,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        alignItems: "center",
    },
    disabled: {
        opacity: 0.6,
    },
    saveLabel: {
        ...typography.button,
        color: lightColors.white,
    },
    deleteButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
        alignItems: "center",
    },
    deleteLabel: {
        ...typography.button,
        color: lightColors.error,
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
        backgroundColor: lightColors.paper,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        maxHeight: "70%",
        padding: spacing.lg,
    },
    pickerTitle: {
        ...typography.h3,
        color: lightColors.ink,
        marginBottom: spacing.md,
    },
    pickerItem: {
        padding: spacing.sm,
        borderRadius: 8,
        marginBottom: spacing.xs,
    },
    pickerItemSelected: {
        backgroundColor: lightColors.accent + "20",
    },
    pickerItemText: {
        ...typography.body,
        color: lightColors.ink,
    },
    pickerItemTextSelected: {
        color: lightColors.accent,
        fontWeight: "600",
    },
    cancelButton: {
        marginTop: spacing.md,
        padding: spacing.sm,
        alignItems: "center",
    },
    cancelLabel: {
        ...typography.button,
        color: lightColors.inkLight,
    },
});
