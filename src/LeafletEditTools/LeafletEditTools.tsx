import L from "leaflet";
import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import "leaflet-editable";
import CreateEditablePolygon from "./Buttons/CreateEditablePolygon";
import DisableAllEditing from "./Buttons/DisableAllEditing";
import EnableEditor from "./Buttons/EnableEditor";
import DisableEditor from "./Buttons/DisableEditor";

const LeafletEditTools = ({ children }: { children: React.ReactNode }) => {
  const map = useMap();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editablePolygons, setEditablePolygons] = useState<L.Polygon[]>([]);

  // Funzione per disabilitare l'editing E rimuovere tutti i listener di click
  const disableAllEditingAndListeners = useCallback(() => {
    editablePolygons.forEach((polygon) => {
      // Disabilita l'editing
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
      // Rimuovi tutti i listener di click
      polygon.off("click");
    });

    // Rimuovi i listener anche dai poligoni esistenti sulla mappa
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.off("click");
        }
      });
    }

    console.log("🔒 Tutti i listener di editing rimossi");
  }, [editablePolygons, map]); // Dipendenze della funzione

  // Funzione per abilitare l'editing di un poligono esistente
  const enablePolygonEditing = useCallback((polygon: L.Polygon) => {
    if (typeof polygon.enableEdit === "function") {
      polygon.enableEdit();
    }
  }, []);

  // Funzione per riattivare i listener sui poligoni esistenti
  const reactivatePolygonListeners = useCallback(() => {
    if (!map || !isEditorVisible) return;

    editablePolygons.forEach((polygon) => {
      // Rimuovi eventuali listener esistenti per evitare duplicati
      polygon.off("click");
      // Aggiungi il nuovo listener
      polygon.on("click", () => {
        enablePolygonEditing(polygon);
      });
    });

    console.log("🔄 Listener di editing riattivati");
  }, [map, isEditorVisible, editablePolygons, enablePolygonEditing]);

  useEffect(() => {
    if (!map) return;

    if (isEditorVisible) {
      // Attiva la modalità editable se non è già attiva
      if (!map.editTools) {
        map.editTools = new L.Editable(map, {
          // Opzioni personalizzate (facoltative)
          // drawingCSSClass: 'leaflet-editable-drawing',
          // editLayer: someLayer,
          // featuresLayer: someOtherLayer
        });
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
          setEditablePolygons((prev) => [...prev, layer]);
        }
      };

      map.on("editable:drawing:start", onDrawingStart);
      map.on("editable:drawing:end", onDrawingEnd);

      return () => {
        map.off("editable:drawing:start", onDrawingStart);
        map.off("editable:drawing:end", onDrawingEnd);
      };
    } else {
      // Quando l'editor è nascosto, disabilita completamente la modalità editing
      disableAllEditingAndListeners();

      // Opzionale: rimuovi completamente editTools se vuoi "resettare" tutto
      // if (map.editTools) {
      //   delete map.editTools;
      //   console.log("🔒 Leaflet.Editable rimosso");
      // }
    }
  }, [
    map,
    isEditorVisible,
    enablePolygonEditing,
    disableAllEditingAndListeners,
  ]);

  // Funzione per rendere editabili i poligoni esistenti
  useEffect(() => {
    if (!map || !map.editTools || !isEditorVisible) return;

    // Funzione per registrare un poligono esistente
    const registerExistingPolygon = (layer: L.Polygon) => {
      if (!editablePolygons.includes(layer)) {
        // Rimuovi eventuali listener esistenti
        layer.off("click");
        // Aggiungi il listener per l'editing
        layer.on("click", () => {
          enablePolygonEditing(layer);
        });
        setEditablePolygons((prev) => [...prev, layer]);
      }
    };

    // Accedi ai layer della mappa
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        registerExistingPolygon(layer);
      }
    });
  }, [map, editablePolygons, isEditorVisible, enablePolygonEditing]);

  // Riattiva i listener quando l'editor diventa visibile
  useEffect(() => {
    if (isEditorVisible) {
      reactivatePolygonListeners();
    }
  }, [isEditorVisible, reactivatePolygonListeners]);

  return (
    <>
      {children}
      <EnableEditor
        isEditorVisible={isEditorVisible}
        setIsEditorVisible={setIsEditorVisible}
      />
      <div
        style={{
          visibility: isEditorVisible ? "visible" : "hidden",
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
        <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools</h2>
        <DisableEditor setIsEditorVisible={setIsEditorVisible} />
        <CreateEditablePolygon map={map} />
        <DisableAllEditing editablePolygons={editablePolygons} />
      </div>
    </>
  );
};

export default LeafletEditTools;
