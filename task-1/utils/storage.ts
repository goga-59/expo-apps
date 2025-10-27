import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MarkerData, PhotoData } from "@/types";

const STORAGE_KEY = "markers";

export const getMarkers = async (): Promise<MarkerData[]> => {
    try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        throw e;
    }
};

export const saveMarkers = async (markers: MarkerData[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
    } catch (e) {
        throw e;
    }
};

export const getMarkerById = async (markerId: string): Promise<MarkerData | null> => {
    try {
        const markers = await getMarkers();
        const marker = markers.find((m) => m.id === markerId);
        return marker ?? null;
    } catch (e) {
        throw e;
    }
};

export async function updateMarker(updated: MarkerData) {
    try {
        const markers = await getMarkers();
        const index = markers.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
            markers[index] = updated;
            await saveMarkers(markers);
        }
    } catch (e) {
        throw e;
    }
}

export const addMarker = async (marker: MarkerData) => {
    try {
        const markers = await getMarkers();
        markers.push(marker);
        await saveMarkers(markers);
    } catch (e) {
        throw e;
    }
};

export const removeMarker = async (markerId: string) => {
    try {
        const markers = await getMarkers();
        const newMarkers = markers.filter(item => item.id !== markerId);
        await saveMarkers(newMarkers);
    } catch (e) {
        throw e;
    }
}

export const getPhotos = async (markerId: string): Promise<PhotoData[]> => {
    try {
        const markers = await getMarkers();
        const marker = markers.find((m) => m.id === markerId);
        return marker ? marker.photos : [];
    } catch (e) {
        throw e;
    }
};

export const addPhoto = async (markerId: string, photo: PhotoData) => {
    try {
        const markers = await getMarkers();
        const marker = markers.find((m) => m.id === markerId);
        if (marker) {
            marker.photos.push(photo);
            await saveMarkers(markers);
        }
    } catch (e) {
        throw e;
    }
};

export const removePhoto = async (markerId: string, photoId: string) => {
    try {
        const marker = await getMarkerById(markerId);
        if (!marker) return;
        marker.photos = marker.photos.filter((photo: PhotoData) => photo.id !== photoId);
        await updateMarker(marker);
    } catch (e) {
        throw e;
    }
};