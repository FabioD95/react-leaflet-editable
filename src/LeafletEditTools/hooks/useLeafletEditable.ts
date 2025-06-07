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
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
      return newMap;
    });
  }, []);

  // Funzione per aggiungere un poligono esistente (già presente sulla mappa)
  const addExistingPolygon = useCallback(
    (polygon: L.Polygon) => {
      if (!editablePolygons.includes(polygon)) {
        const coordinates = polygon.getLatLngs();
        let flatCoords: L.LatLng[];

        // Gestisci sia poligoni semplici che multipoligoni
        if (Array.isArray(coordinates[0])) {
          flatCoords = coordinates[0] as L.LatLng[];
        } else {
          flatCoords = coordinates as L.LatLng[];
        }

        // Crea una copia profonda delle coordinate originali
        const originalCoordinates = flatCoords.map((coord) =>
          L.latLng(coord.lat, coord.lng)
        );

        console.log("💾 Salvando coordinate originali:", originalCoordinates);

        setEditablePolygons((prev) => [...prev, polygon]);
        setPolygonStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(polygon, {
            polygon,
            isNew: false,
            isModified: false,
            originalCoordinates: originalCoordinates,
            id: `existing-${polygon._leaflet_id}`,
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

  // Funzione per ottenere solo i poligoni nuovi, modificati o eliminati
  const getChangedPolygons = useCallback(() => {
    const changedPolygons: L.Polygon[] = [];
    polygonStates.forEach((state, polygon) => {
      if (state.isNew || state.isModified || state.isDeleted) {
        changedPolygons.push(polygon);
      }
    });
    return changedPolygons;
  }, [polygonStates]);

  // Funzione per rimuovere/marcare come eliminato un poligono
  const removePolygon = useCallback(
    (polygon: L.Polygon) => {
      const state = polygonStates.get(polygon);

      if (state?.isNew) {
        // Se è un poligono nuovo, rimuovilo completamente
        setEditablePolygons((prev) => prev.filter((p) => p !== polygon));
        setPolygonStates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(polygon);
          return newMap;
        });
      } else {
        // Se è un poligono esistente, marcalo come eliminato
        setPolygonStates((prev) => {
          const newMap = new Map(prev);
          const currentState = newMap.get(polygon);
          if (currentState) {
            newMap.set(polygon, {
              ...currentState,
              isDeleted: true,
            });
          }
          return newMap;
        });
        // Rimuovi dalla lista dei poligoni editabili ma mantieni lo stato
        setEditablePolygons((prev) => prev.filter((p) => p !== polygon));
      }

      if (currentEditingPolygon === polygon) {
        setCurrentEditingPolygon(null);
      }
    },
    [currentEditingPolygon, polygonStates]
  );

  // Funzione per resettare i flag di modifica dopo il salvataggio
  const resetModificationFlags = useCallback(() => {
    setPolygonStates((prev) => {
      const newMap = new Map();
      prev.forEach((state, polygon) => {
        // Rimuovi completamente i poligoni eliminati dopo il salvataggio
        if (!state.isDeleted) {
          const coordinates = polygon.getLatLngs();
          const flatCoords = Array.isArray(coordinates[0])
            ? (coordinates[0] as L.LatLng[])
            : (coordinates as L.LatLng[]);

          newMap.set(polygon, {
            polygon,
            isNew: false,
            isModified: false,
            originalCoordinates: [...flatCoords], // Aggiorna le coordinate originali
            id: state.id,
          });
        }
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

  // Funzione per ripristinare le coordinate originali di un poligono
  const restorePolygonOriginalCoordinates = useCallback(
    (polygon: L.Polygon) => {
      const state = polygonStates.get(polygon);

      if (!state || state.isNew) {
        console.warn(
          "⚠️ Impossibile ripristinare: poligono nuovo o stato non trovato"
        );
        return false;
      }

      if (
        !state.originalCoordinates ||
        state.originalCoordinates.length === 0
      ) {
        console.warn(
          "⚠️ Impossibile ripristinare: coordinate originali non disponibili"
        );
        return false;
      }

      try {
        console.log(
          "🔄 Ripristinando coordinate originali:",
          state.originalCoordinates
        );

        // Disabilita l'editing temporaneamente
        if (typeof polygon.disableEdit === "function") {
          polygon.disableEdit();
        }

        // Crea una copia profonda delle coordinate originali
        const originalCoords = state.originalCoordinates.map((coord) =>
          L.latLng(coord.lat, coord.lng)
        );

        // Ripristina le coordinate originali
        polygon.setLatLngs([originalCoords]);

        // Forza il redraw del poligono
        polygon.redraw();

        // Aggiorna lo stato per rimuovere il flag di modifica
        setPolygonStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(polygon, {
            ...state,
            isModified: false,
          });
          return newMap;
        });

        // Riabilita l'editing se era il poligono correntemente in editing
        if (currentEditingPolygon === polygon) {
          setTimeout(() => {
            if (typeof polygon.enableEdit === "function") {
              polygon.enableEdit();

              // Riattiva il listener per le modifiche
              polygon.off("editable:editing");
              polygon.on("editable:editing", () => {
                markPolygonAsModified(polygon);
                console.log("✏️ Poligono modificato:", polygon);
              });
            }
          }, 100);
        }

        console.log("✅ Coordinate originali ripristinate per il poligono");
        return true;
      } catch (error) {
        console.error(
          "❌ Errore durante il ripristino delle coordinate:",
          error
        );
        return false;
      }
    },
    [polygonStates, currentEditingPolygon, markPolygonAsModified]
  );

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
    restorePolygonOriginalCoordinates, // Nuova funzione
  };
};
