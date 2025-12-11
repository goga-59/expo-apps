import { MarkerSelect } from "@/database/schema";
import * as Location from "expo-location";
import { notificationManager } from "./notification";
import { LatLng } from "react-native-maps";

export type LocationConfig = {
    accuracy: Location.Accuracy;
    timeInterval: number;
    distanceInterval: number;
}

class LocationManager {
    private static readonly PROXIMITY_RADIUS = 200;
    private static readonly EARTH_RADIUS = 6371e3;
    private static readonly DEFAULT_CONFIG: LocationConfig = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 20
    }

    private config: LocationConfig;
    private location: LatLng | null;
    private subscription: Location.LocationSubscription | null;

    constructor(config?: Partial<LocationConfig>) {
        this.config = {
            ...LocationManager.DEFAULT_CONFIG,
            ...config,
        };

        this.location = null;
        this.subscription = null;
    }

    public async requestLocationPermissions(): Promise<void> {
        const { status: foreground } = await Location.requestForegroundPermissionsAsync();

        if (foreground !== 'granted') {
            throw new Error('Location foreground permission denied');
        }

        const { status: background } = await Location.requestBackgroundPermissionsAsync();

        if (background !== 'granted') {
            throw new Error('Location background permission denied');
        }
    }

    public async getCurrentLocation(): Promise<LatLng | null> {
        try {
            const loc = await Location.getCurrentPositionAsync({
                accuracy: this.config.accuracy,
            });

            this.location = loc.coords;
            return this.location;
        } catch (e) {
            console.log("Failed to get current location ", e);
            return null;
        }
    }

    public async getFormattedAddress(coordinate: LatLng): Promise<string | null> {
        const results = await Location.reverseGeocodeAsync(coordinate);
        if (!results?.length) return null
        return results[0].formattedAddress ?? null
    }

    public async startLocationUpdates(
        onLocation: (location: LatLng) => void
    ): Promise<Location.LocationSubscription | null> {
        if (this.subscription) return this.subscription;

        this.subscription = await Location.watchPositionAsync(
            this.config,
            (loc) => {
                this.location = loc.coords;
                onLocation(this.location);
            }
        );

        return this.subscription;
    }

    public stopLocationUpdates(): void {
        this.subscription?.remove();
        this.subscription = null;
    }

    public async checkProximity(userCoords: LatLng, markers: MarkerSelect[]): Promise<void> {
        const tasks = markers.map(marker => {
            const markerCoords = marker.coordinate;
            const distance = this.calculateDistance(
                userCoords.latitude,
                userCoords.longitude,
                markerCoords.latitude,
                markerCoords.longitude
            );

            if (distance <= LocationManager.PROXIMITY_RADIUS)
                return notificationManager.showNotification(marker);

            return notificationManager.removeNotification(marker.id);
        });

        await Promise.all(tasks);
    }

    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const sinHalfΔφ = Math.sin(Δφ / 2);
        const sinHalfΔλ = Math.sin(Δλ / 2);

        const a = sinHalfΔφ * sinHalfΔφ + Math.cos(φ1) * Math.cos(φ2) * sinHalfΔλ * sinHalfΔλ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return LocationManager.EARTH_RADIUS * c;
    }

}

export const locationManager = new LocationManager();