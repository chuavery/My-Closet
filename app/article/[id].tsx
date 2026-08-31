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
import { Camera, Image as ImageIcon, Pencil } from "lucide-react-native";
import { useSettings } from "@/viewmodels/useSettings";
import { useTheme } from "@/providers/ThemeContext";
import { ArticleType, Color, Fit } from "@/models/Article";
import { capitalize } from "@/lib/capitalize";
import { StorageSpace } from "@/models/StorageSpace";
import { ARTICLE_COLORS } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";
import { typeTagStyles, fitTagStyles, colorTagStyles } from "@/theme/chipStyles";

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

export default function ArticleDetailScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { form, updateField, pickImage, takePhoto, save, remove, loading, saving, isNew, wearCount, lastWornAt } =
        useArticleForm(id);

    const { storageSpaceRepository } = useRepositories();
    const { settings } = useSettings();
    const { colors } = useTheme();
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
                        {editing ? (
                            <Text style={[styles.headerButtonText, { color: colors.accent }]}>Cancel</Text>
                        ) : (
                            <Pencil size={20} color={colors.accent} />
                        )}
                    </Pressable>
                );
            },
        });
    }, [navigation, editing, isNew, colors.accent]);

    useEffect(() => {
        navigation.setOptions({ title: form.name || "Article" });
    }, [navigation, form.name]);

    const selectedSpace = spaces.find((s) => s.id === form.storageSpaceId);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {form.originalImageUrl ? (
                <View style={styles.imagePreview}>
                    <Image
                        source={{ uri: form.originalImageUrl }}
                        style={styles.previewImage}
                    />
                    {editing && (
                        <Pressable style={styles.changePhotoButton} onPress={pickImage}>
                            <Text style={[styles.changePhotoLabel, { color: colors.accent }]}>Change Photo</Text>
                        </Pressable>
                    )}
                </View>
            ) : editing ? (
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
            ) : (
                <Text style={[styles.emptyValue, { color: colors.inkMuted }]}>No photo</Text>
            )}

            <View style={styles.tags}>
                <View style={typeTagStyles(colors).container}>
                    <Text style={typeTagStyles(colors).label}>{capitalize(form.articleType)}</Text>
                </View>
                <View style={colorTagStyles(colors, ARTICLE_COLORS[form.color] ?? colors.accent, form.color === 'white', false).container}>
                    <Text style={colorTagStyles(colors, ARTICLE_COLORS[form.color] ?? colors.accent, form.color === 'white', false).label}>
                        {capitalize(form.color)}
                    </Text>
                </View>
                <View style={fitTagStyles(colors).container}>
                    <Text style={fitTagStyles(colors).label}>{capitalize(form.fit)}</Text>
                </View>
            </View>

            <Text style={[styles.sectionHeader, { color: colors.inkSecondary }]}>Details</Text>
            <Text style={[styles.label, { color: colors.inkSecondary }]}>Name</Text>
            <Text style={[styles.value, { color: colors.inkPrimary }]}>{form.name || "---"}</Text>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Brand</Text>
            <Text style={[styles.value, { color: colors.inkPrimary }]}>{form.brand || "---"}</Text>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Size</Text>
            <Text style={[styles.value, { color: colors.inkPrimary }]}>{form.size || "---"}</Text>

            <Text style={[styles.label, { color: colors.inkSecondary }]}>Fabric</Text>
            <Text style={[styles.value, { color: colors.inkPrimary }]}>{form.fabricType || "---"}</Text>

            {/* TODO: Wear History — re-enable when wear tracking is turned on
            {settings.wearHistoryEnabled && (
                <>
                    <Text style={[styles.sectionHeader, { color: colors.inkSecondary }]}>Wear Tracking</Text>
                    <Text style={[styles.label, { color: colors.inkSecondary }]}>Wear Count</Text>
                    <Text style={[styles.value, { color: colors.inkPrimary }]}>{wearCount}</Text>

                    <Text style={[styles.label, { color: colors.inkSecondary }]}>Last Worn</Text>
                    <Text style={[styles.value, { color: colors.inkPrimary }]}>
                        {lastWornAt
                            ? new Date(lastWornAt).toLocaleDateString()
                            : "---"}
                    </Text>
                </>
            )}
            */}

            <Text style={[styles.sectionHeader, { color: colors.inkSecondary }]}>Location</Text>
            <Text style={[styles.label, { color: colors.inkSecondary }]}>Storage Space</Text>
            {editing ? (
                <Pressable
                    style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowSpacePicker(true)}
                >
                    <Text style={[styles.dropdownText, { color: colors.inkPrimary }, !selectedSpace && { color: colors.inkMuted }]}>
                        {selectedSpace?.name ?? "Unassigned"}
                    </Text>
                    <Text style={[styles.dropdownArrow, { color: colors.inkMuted }]}>v</Text>
                </Pressable>
            ) : (
                <Text style={[styles.value, { color: colors.inkPrimary }]}>{selectedSpace?.name ?? "Unassigned"}</Text>
            )}

            {editing && (
                <Pressable
                    style={[styles.saveButton, { backgroundColor: colors.accent }, saving && styles.disabled]}
                    onPress={async () => {
                        const result = await save();
                        if (result) {
                            setEditing(false);
                            router.back();
                        }
                    }}
                    disabled={saving}
                >
                    <Text style={[styles.saveLabel, { color: colors.surface }]}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Text>
                </Pressable>
            )}

            {editing && (
                <Pressable
                    style={[styles.deleteButton, { borderColor: colors.destructive }]}
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
                    <Text style={[styles.deleteLabel, { color: colors.destructive }]}>Delete Article</Text>
                </Pressable>
            )}

            {showSpacePicker && (
                <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.pickerContent, { backgroundColor: colors.background }]}>
                        <Text style={[styles.pickerTitle, { color: colors.inkPrimary }]}>Select Storage Space</Text>
                        <Pressable
                            style={[styles.pickerItem, !form.storageSpaceId && { backgroundColor: colors.accent + "15" }]}
                            onPress={() => {
                                updateField("storageSpaceId", null);
                                setShowSpacePicker(false);
                            }}
                        >
                            <Text style={[styles.pickerItemText, { color: colors.inkPrimary }, !form.storageSpaceId && { color: colors.accent, fontWeight: "600" }]}>
                                Unassigned
                            </Text>
                        </Pressable>
                        {spaces.map((space) => (
                            <Pressable
                                key={space.id}
                                style={[styles.pickerItem, form.storageSpaceId === space.id && { backgroundColor: colors.accent + "15" }]}
                                onPress={() => {
                                    updateField("storageSpaceId", space.id);
                                    setShowSpacePicker(false);
                                }}
                            >
                                <Text style={[styles.pickerItemText, { color: colors.inkPrimary }, form.storageSpaceId === space.id && { color: colors.accent, fontWeight: "600" }]}>
                                    {space.name}
                                    {space.subLocation ? ` — ${space.subLocation}` : ""}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setShowSpacePicker(false)}
                        >
                            <Text style={[styles.cancelLabel, { color: colors.inkSecondary }]}>Cancel</Text>
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
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    headerButtonText: {
        ...typography.buttonSmall,
    },
    sectionHeader: {
        ...typography.caption,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: spacing.xxl,
        marginBottom: spacing.xs,
    },
    label: {
        ...typography.bodySmall,
        fontWeight: "600",
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    value: {
        ...typography.body,
    },
    emptyValue: {
        ...typography.body,
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
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    dropdownText: {
        ...typography.body,
    },
    dropdownArrow: {
        ...typography.caption,
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
    pickerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
    },
    pickerContent: {
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        maxHeight: "70%",
        padding: spacing.lg,
    },
    pickerTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    pickerItem: {
        padding: spacing.sm,
        borderRadius: 8,
        marginBottom: spacing.xs,
    },
    pickerItemText: {
        ...typography.body,
    },
    cancelButton: {
        marginTop: spacing.md,
        padding: spacing.sm,
        alignItems: "center",
    },
    cancelLabel: {
        ...typography.button,
    },
});
