import { useState, useEffect } from "react";
import L from "leaflet";

export const useEditorVisibility = (
  map: L.Map | undefined,
  disableAllEditingAndListeners: () => void,
  enablePolygonEditing: (polygon: L.Polygon) => void,
  addNewPolygon: (polygon: L.Polygon) => void
) => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  useEffect(() => {
    if (!map) return;

    if (isEditorVisible) {
      // Attiva la modalità editable se non è già attiva
      if (!map.editTools) {
        map.editTools = new L.Editable(map, {});
        console.log("🔧 Leaflet.Editable inizializzato");
      }

      // Setup eventi Leaflet.Editable
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
          addNewPolygon(layer); // Usa la nuova funzione per poligoni nuovi
        }
      };

      map.on("editable:drawing:start", onDrawingStart);
      map.on("editable:drawing:end", onDrawingEnd);

      return () => {
        map.off("editable:drawing:start", onDrawingStart);
        map.off("editable:drawing:end", onDrawingEnd);
      };
    } else {
      disableAllEditingAndListeners();
    }
  }, [
    map,
    isEditorVisible,
    enablePolygonEditing,
    disableAllEditingAndListeners,
    addNewPolygon,
  ]);

  return { isEditorVisible, setIsEditorVisible };
};
