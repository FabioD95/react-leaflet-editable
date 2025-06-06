import L from "leaflet";

export interface PolygonState {
  polygon: L.Polygon;
  isNew: boolean;
  isModified: boolean;
  isDeleted?: boolean;
  originalCoordinates?: L.LatLng[];
  id?: string; // Aggiungiamo un ID per tracciare i poligoni eliminati
}

export interface PolygonSaveData {
  newPolygons: L.LatLng[][];
  modifiedPolygons: { id: string; coordinates: L.LatLng[] }[];
  deletedPolygons: string[];
}

export interface LeafletEditToolsProps {
  children: React.ReactNode;
  onSavePolygons?: (data: PolygonSaveData) => Promise<void> | void;
}
