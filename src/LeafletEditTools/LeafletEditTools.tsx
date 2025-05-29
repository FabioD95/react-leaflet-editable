import type { LatLngExpression, LeafletEvent } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Polygon, useMap } from "react-leaflet";

interface LeafletEditToolsProps {
  polygons?: LatLngExpression[][];
}

const LeafletEditTools = ({ polygons = [] }: LeafletEditToolsProps) => {
  const map = useMap();
  const [selectedPolygonLayerId, setSelectedPolygonLayerId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!map || !map.editTools) return;
    const onDrawingEnd = (e: LeafletEvent) =>
      console.log("✅ Disegno completato", e);
    map.on("editable:drawing:end", onDrawingEnd);
    return () => {
      map.off("editable:drawing:end", onDrawingEnd);
    };
  }, [map]);

  const startEditing = () => {
    if (!selectedPolygonLayerId || !map || !map.editTools) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        const polygonLayer = layer as L.Polygon;
        if (
          selectedPolygonLayerId ===
          (polygonLayer as unknown as { _leaflet_id: number })._leaflet_id
        ) {
          polygonLayer.enableEdit();
        }
      }
    });
  };

  return (
    <>
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
        <button
          onClick={startEditing}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ✏️ Modifica Poligono
        </button>
      </div>
      {polygons.map((polygon, index) => (
        <Polygon
          key={index}
          positions={polygon}
          eventHandlers={{
            click: (leafletEvent: LeafletEvent) => {
              setSelectedPolygonLayerId(leafletEvent.target._leaflet_id);
              console.log("leafletEvent:", leafletEvent.target._leaflet_id);
            },
          }}
          pathOptions={
            {
              // color: selectedPolygonLayerId === index ? "red" : "blue",
            }
          }
        />
      ))}
    </>
  );
};

export default LeafletEditTools;
