import L from "leaflet";
import { useState, useCallback } from "react";

export const useLeafletEditable = (map: L.Map | undefined) => {
  const [editablePolygons, setEditablePolygons] = useState<L.Polygon[]>([]);
  const [currentEditingPolygon, setCurrentEditingPolygon] =
    useState<L.Polygon | null>(null);

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

    setCurrentEditingPolygon(null);
    console.log("🔒 Tutti i listener di editing rimossi");
  }, [editablePolygons, map]);

  // Funzione per abilitare l'editing di un poligono esistente
  const enablePolygonEditing = useCallback(
    (polygon: L.Polygon) => {
      // Prima disabilita l'editing di tutti gli altri poligoni
      editablePolygons.forEach((p) => {
        if (p !== polygon && typeof p.disableEdit === "function") {
          p.disableEdit();
        }
      });

      // Abilita l'editing del poligono selezionato
      if (typeof polygon.enableEdit === "function") {
        polygon.enableEdit();
        setCurrentEditingPolygon(polygon);
        console.log("✏️ Poligono in editing:", polygon);
      }
    },
    [editablePolygons]
  );

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
    currentEditingPolygon,
    setCurrentEditingPolygon,
    disableAllEditingAndListeners,
    enablePolygonEditing,
    reactivatePolygonListeners,
  };
};
