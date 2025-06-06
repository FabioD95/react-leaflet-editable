import L from "leaflet";
import { useState, useCallback } from "react";
import type { PolygonState } from "../types";

export const useLeafletEditable = (map: L.Map | undefined) => {
  const [editablePolygons, setEditablePolygons] = useState<L.Polygon[]>([]);
  const [currentEditingPolygon, setCurrentEditingPolygon] =
    useState<L.Polygon | null>(null);
  const [polygonStates, setPolygonStates] = useState<
    Map<L.Polygon, PolygonState>
  >(new Map());

  // Funzione per aggiungere un nuovo poligono (creato dall'utente)
  const addNewPolygon = useCallback((polygon: L.Polygon) => {
    setEditablePolygons((prev) => [...prev, polygon]);
    setPolygonStates((prev) => {
      const newMap = new Map(prev);
      newMap.set(polygon, {
        polygon,
        isNew: true,
        isModified: false,
      });
      return newMap;
    });
  }, []);

  // Funzione per aggiungere un poligono esistente (già presente sulla mappa)
  const addExistingPolygon = useCallback(
    (polygon: L.Polygon) => {
      if (!editablePolygons.includes(polygon)) {
        const coordinates = polygon.getLatLngs();
        const flatCoords = Array.isArray(coordinates[0])
          ? (coordinates[0] as L.LatLng[])
          : (coordinates as L.LatLng[]);

        setEditablePolygons((prev) => [...prev, polygon]);
        setPolygonStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(polygon, {
            polygon,
            isNew: false,
            isModified: false,
            originalCoordinates: [...flatCoords], // Copia delle coordinate originali
          });
          return newMap;
        });
      }
    },
    [editablePolygons]
  );

  // Funzione per marcare un poligono come modificato
  const markPolygonAsModified = useCallback((polygon: L.Polygon) => {
    setPolygonStates((prev) => {
      const newMap = new Map(prev);
      const currentState = newMap.get(polygon);
      if (currentState && !currentState.isNew) {
        newMap.set(polygon, {
          ...currentState,
          isModified: true,
        });
      }
      return newMap;
    });
  }, []);

  // Funzione per ottenere solo i poligoni nuovi o modificati
  const getChangedPolygons = useCallback(() => {
    const changedPolygons: L.Polygon[] = [];
    polygonStates.forEach((state, polygon) => {
      if (state.isNew || state.isModified) {
        changedPolygons.push(polygon);
      }
    });
    return changedPolygons;
  }, [polygonStates]);

  // Funzione per rimuovere un poligono
  const removePolygon = useCallback(
    (polygon: L.Polygon) => {
      setEditablePolygons((prev) => prev.filter((p) => p !== polygon));
      setPolygonStates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(polygon);
        return newMap;
      });
      if (currentEditingPolygon === polygon) {
        setCurrentEditingPolygon(null);
      }
    },
    [currentEditingPolygon]
  );

  // Funzione per resettare i flag di modifica dopo il salvataggio
  const resetModificationFlags = useCallback(() => {
    setPolygonStates((prev) => {
      const newMap = new Map();
      prev.forEach((_, polygon) => {
        const coordinates = polygon.getLatLngs();
        const flatCoords = Array.isArray(coordinates[0])
          ? (coordinates[0] as L.LatLng[])
          : (coordinates as L.LatLng[]);

        newMap.set(polygon, {
          polygon,
          isNew: false,
          isModified: false,
          originalCoordinates: [...flatCoords], // Aggiorna le coordinate originali
        });
      });
      return newMap;
    });
  }, []);

  // Funzione per disabilitare l'editing E rimuovere tutti i listener di click
  const disableAllEditingAndListeners = useCallback(() => {
    editablePolygons.forEach((polygon) => {
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
      polygon.off("click");
      polygon.off("editable:editing"); // Rimuovi listener di modifica
    });

    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.off("click");
          layer.off("editable:editing");
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

        // Aggiungi listener per tracciare le modifiche
        polygon.off("editable:editing"); // Rimuovi listener esistenti
        polygon.on("editable:editing", () => {
          markPolygonAsModified(polygon);
          console.log("✏️ Poligono modificato:", polygon);
        });

        console.log("✏️ Poligono in editing:", polygon);
      }
    },
    [editablePolygons, markPolygonAsModified]
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
    polygonStates,
    addNewPolygon,
    addExistingPolygon,
    removePolygon,
    getChangedPolygons,
    resetModificationFlags,
    disableAllEditingAndListeners,
    enablePolygonEditing,
    reactivatePolygonListeners,
  };
};
