import { LatLng } from "react-native-maps";

export type MarkerData = {
    id: string;
    title: string;
    description: string;
    coordinate: LatLng;
    photos: PhotoData[];
}

export type PhotoData = {
    id: string;
    uri: string;
}

export type NavigationTypes = {
    Index: undefined;
    MarkerId: { id: string };
    MarkerInformation: { id: string };
    MarkerPhotos: { id: string };
}