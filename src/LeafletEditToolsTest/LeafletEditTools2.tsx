import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-editable";

const LeafletEditTools = () => {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.editTools) return;

    // Setup eventi Leaflet.Editable
    if (map.editTools) {
      const onDrawingStart = (e: L.LeafletEvent) => {
        console.log("🎨 Inizio disegno", e);
      };

      const onDrawingEnd = (e: L.LeafletEvent) => {
        console.log("✅ Disegno completato", e);

        const layer = e.layer;

        if (layer && layer instanceof L.Polygon) {
          layer.on("click", () => {
            enablePolygonEditing(layer);
          });

          layer.disableEdit();
        }
      };

      map.on("editable:drawing:start", onDrawingStart);
      map.on("editable:drawing:end", onDrawingEnd);

      return () => {
        map.off("editable:drawing:start", onDrawingStart);
        map.off("editable:drawing:end", onDrawingEnd);
      };
    }
  }, [map]);

  const createEditablePolygon = () => {
    if (!map || !map.editTools) return;

    map.editTools.startPolygon();
  };

  // Funzione per abilitare l'editing di un poligono esistente
  const enablePolygonEditing = (polygon: L.Polygon) => {
    if (typeof polygon.enableEdit === "function") {
      polygon.enableEdit();
    }
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
        <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools 2</h2>

        <button
          onClick={createEditablePolygon}
          style={{
            padding: "10px",
            color: "white",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          🖊️ Disegna Poligono Editabile
        </button>
      </div>
    </>
  );
};

export default LeafletEditTools;
