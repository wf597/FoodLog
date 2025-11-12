import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'camera' | 'barcode' | 'gallery'>('camera');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Loading state
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting permission...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No access to camera. Please enable it in settings.</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await (cameraRef.current as any).takePictureAsync({
          quality: 1,
        });
        console.log('Photo taken:', photo.uri);
        // Navigate to ScanResultScreen with the photo URI
        console.log('Navigating to ScanResultScreen with imageUri:', photo.uri);
        router.push({
          pathname: '/ScanResultScreen',
          params: { imageUri: photo.uri },
        } as any);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera View as Background */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
      />

      {/* Overlay UI */}
      <SafeAreaView style={styles.overlay}>
        {/* A. Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Al Camera</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-circle" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* B. Middle Scan Area (Placeholder) */}
        <View style={styles.scanAreaPlaceholder} />

        {/* C. Bottom Bar */}
        <View style={styles.bottomBar}>
          {/* C1. Shutter Button */}
          <View style={styles.shutterButtonContainer}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <View style={styles.shutterButtonInner} />
            </TouchableOpacity>
          </View>

          {/* C2. Mode Switch */}
          <View style={styles.modeSwitch}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'camera' && styles.modeButtonActive]}
              onPress={() => setMode('camera')}
            >
              <Text style={[styles.modeButtonText, mode === 'camera' && styles.modeButtonTextActive]}>
                Al Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'barcode' && styles.modeButtonActive]}
              onPress={() => setMode('barcode')}
            >
              <Text style={[styles.modeButtonText, mode === 'barcode' && styles.modeButtonTextActive]}>
                Al Barcode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'gallery' && styles.modeButtonActive]}
              onPress={() => setMode('gallery')}
            >
              <Text style={[styles.modeButtonText, mode === 'gallery' && styles.modeButtonTextActive]}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    color: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scanAreaPlaceholder: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 100,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  shutterButtonContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: 'white',
  },
  modeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#000',
  },
});
