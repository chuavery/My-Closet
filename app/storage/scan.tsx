import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useStorageSpaces } from "@/viewmodels/useStorageSpaces";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing, borderRadius } from "@/theme/spacing";

export default function QRScanScreen() {
    const router = useRouter();
    const { findByQrCode } = useStorageSpaces();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(true);
    const scannedRef = useRef(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    const handleBarcodeScanned = async (result: { data: string }) => {
        if (scannedRef.current) return;
        scannedRef.current = true;
        setScanning(false);

        const space = await findByQrCode(result.data);
        if (space) {
            router.replace(`/storage/${space.id}`);
        } else {
            Alert.alert(
                "Space not found",
                `No storage space matches this QR code.\n\nScanned value: ${result.data}`,
                [
                    {
                        text: "Scan Again",
                        onPress: () => {
                            scannedRef.current = false;
                            setScanning(true);
                        },
                    },
                    { text: "OK", onPress: () => router.back() },
                ]
            );
        }
    };

    if (!permission) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>
                    Camera permission is required to scan QR codes.
                </Text>
                <Pressable style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionLabel}>Grant Permission</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <Text style={styles.instruction}>
                        Point camera at a storage space QR code
                    </Text>
                </View>
            </CameraView>
        </View>
    );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;
const FRAME_SIZE = 250;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.paper,
        padding: spacing.lg,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
    },
    corner: {
        position: "absolute",
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: colors.white,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: CORNER_WIDTH,
        borderLeftWidth: CORNER_WIDTH,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: CORNER_WIDTH,
        borderRightWidth: CORNER_WIDTH,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: CORNER_WIDTH,
        borderLeftWidth: CORNER_WIDTH,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: CORNER_WIDTH,
        borderRightWidth: CORNER_WIDTH,
    },
    instruction: {
        ...typography.body,
        color: colors.white,
        textAlign: "center",
        marginTop: spacing.xl,
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    empty: {
        ...typography.body,
        color: colors.inkLight,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    permissionButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 8,
    },
    permissionLabel: {
        ...typography.button,
        color: colors.white,
    },
});
