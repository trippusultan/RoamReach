import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';
import { Backpacker } from '../../data/mockData';

interface MapViewComponentProps {
  backpackers: Backpacker[];
  userLocation: { latitude: number; longitude: number } | null;
  onBackpackerPress: (backpacker: Backpacker) => void;
  style?: any;
}

const { width } = Dimensions.get('window');

// Conditionally load react-native-maps only on native platforms
let MapViewComp: React.ComponentType<any>;
let MarkerComp: React.ComponentType<any>;
let CircleComp: React.ComponentType<any>;
let PROVIDER_GOOGLE: any;

if (Platform.OS === 'web') {
  MapViewComp = View;
  MarkerComp = () => null;
  CircleComp = () => null;
} else {
  const maps = require('react-native-maps');
  MapViewComp = maps.default;
  MarkerComp = maps.Marker;
  CircleComp = maps.Circle;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

export const DiscoverMapView: React.FC<MapViewComponentProps> = ({
  backpackers,
  userLocation,
  onBackpackerPress,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webPlaceholder}>
          <ActivityIndicator size="small" color="#D4AF37" />
        </View>
      ) : (
        <MapViewComp
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          {userLocation && (
            <CircleComp
              center={userLocation}
              radius={50}
              strokeColor="rgba(0,0,0,0.2)"
              fillColor="rgba(212,175,55,0.2)"
            />
          )}
          {backpackers.map((backpacker) => (
            <MarkerComp
              key={backpacker.id}
              coordinate={{
                latitude: backpacker.latitude,
                longitude: backpacker.longitude,
              }}
              onPress={() => onBackpackerPress(backpacker)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerRing} />
                <View style={styles.markerInner}>
                  <View style={styles.markerDefault}>
                    <Text style={styles.markerInitial}>{backpacker.name[0]}</Text>
                  </View>
                </View>
              </View>
            </MarkerComp>
          ))}
        </MapViewComp>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markerDefault: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInitial: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 16,
  },
  webPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiscoverMapView;
