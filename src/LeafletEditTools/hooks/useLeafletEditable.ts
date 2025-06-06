import L from "leaflet";
import { useState, useCallback } from "react";
import "leaflet-editable";

export const useLeafletEditable = (map: L.Map | undefined) => {
  const [editablePolygons, setEditablePolygons] = useState<L.Polygon[]>([]);

  // Funzione per disabilitare l'editing E rimuovere tutti i listener di click
  const disableAllEditingAndListeners = useCallback(() => {
    editablePolygons.forEach((polygon) => {
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
      polygon.off("click");
    });

    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.off("click");
        }
      });
    }

    console.log("🔒 Tutti i listener di editing rimossi");
  }, [editablePolygons, map]);

  // Funzione per abilitare l'editing di un poligono esistente
  const enablePolygonEditing = useCallback((polygon: L.Polygon) => {
    if (typeof polygon.enableEdit === "function") {
      polygon.enableEdit();
    }
  }, []);

  // Funzione per riattivare i listener sui poligoni esistenti
  const reactivatePolygonListeners = useCallback(() => {
    if (!map) return;

    editablePolygons.forEach((polygon) => {
      polygon.off("click");
      polygon.on("click", () => {
        enablePolygonEditing(polygon);
      });
    });

    console.log("🔄 Listener di editing riattivati");
  }, [map, editablePolygons, enablePolygonEditing]);

  return {
    editablePolygons,
    setEditablePolygons,
    disableAllEditingAndListeners,
    enablePolygonEditing,
    reactivatePolygonListeners,
  };
};
