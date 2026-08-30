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
import { useStorageSpaces } from "@/viewmodels/useStorageSpaces";
import { QRTile } from "@/components/QRTile";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

export default function NewStorageSpaceScreen() {
    const router = useRouter();
    const { createSpace } = useStorageSpaces();
    const [name, setName] = useState("");
    const [subLocation, setSubLocation] = useState("");
    const [saving, setSaving] = useState(false);

    const qrCodeValue = `MYCLOSET-SS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Name required", "Please enter a name for this storage space.");
            return;
        }
        setSaving(true);
        try {
            const space = await createSpace({
                name: name.trim(),
                subLocation: subLocation.trim() || undefined,
                qrCodeValue,
            });
            router.replace(`/storage/${space.id}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.label}>Space Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder='e.g. "Top Shelf" or "Blue Bin"'
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>Sub-location (optional)</Text>
            <TextInput
                style={styles.input}
                value={subLocation}
                onChangeText={setSubLocation}
                placeholder='e.g. "Left side" or "Drawer 2"'
                placeholderTextColor={colors.inkLight}
            />

            <Text style={styles.label}>QR Code</Text>
            <Text style={styles.hint}>
                This QR code will be generated for this space. Print or display
                it to locate articles.
            </Text>
            <View style={styles.qrSection}>
                <QRTile value={qrCodeValue} label={name || "New Space"} />
            </View>

            <Pressable
                style={[styles.saveButton, saving && styles.disabled]}
                onPress={handleSave}
                disabled={saving}
            >
                <Text style={styles.saveLabel}>
                    {saving ? "Saving..." : "Create Space"}
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
    input: {
        ...typography.body,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.ink,
    },
    qrSection: {
        alignItems: "center",
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
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
