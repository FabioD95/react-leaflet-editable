import type { LatLngExpression, LeafletEvent } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface LeafletEditToolsProps {
  polygonsData?: LatLngExpression[][];
  selectedPolygon?: LatLngExpression[] | null;
  //   isEditing: boolean;
  //   onStartEdit: () => void;
  //   onSaveChanges: (data: LatLngExpression[]) => void;
  //   onCancelChanges: () => void;
  //   onPolygonChange: (data: LatLngExpression[]) => void;
}

const LeafletEditTools = ({
  polygonsData,
  selectedPolygon,
}: LeafletEditToolsProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.editTools) return;
    const onDrawingEnd = (e: LeafletEvent) =>
      console.log("✅ Disegno completato", e);
    map.on("editable:drawing:end", onDrawingEnd);
    return () => {
      map.off("editable:drawing:end", onDrawingEnd);
    };
  }, [map]);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        width: "300px",
        height: "90%",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
        gap: "10px",
      }}
    >
      <h2 style={{ alignSelf: "center" }}>Leaflet Edit Tools</h2>

      <button onClick={() => map.editTools.startPolygon()} style={{}}>
        Disegna Poligono
      </button>
    </div>
  );
};

export default LeafletEditTools;
