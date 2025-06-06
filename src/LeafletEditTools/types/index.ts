import L from "leaflet";

export interface PolygonState {
  polygon: L.Polygon;
  isNew: boolean;
  isModified: boolean;
  originalCoordinates?: L.LatLng[];
}

export interface LeafletEditToolsProps {
  children: React.ReactNode;
  onSavePolygons?: (polygons: L.LatLng[][]) => Promise<void> | void;
}