import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import "leaflet-editable";

const LeafletEditTools = ({ children }: { children: React.ReactNode }) => {
  const map = useMap();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editablePolygons, setEditablePolygons] = useState<L.Polygon[]>([]);

  useEffect(() => {
    if (!map) return;

    if (isEditorVisible) {
      // Attiva la modalità editable se non è già attiva
      if (!map.editTools) {
        map.editTools = new L.Editable(map);
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
  }, [map, isEditorVisible]);

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
  }, [map, editablePolygons, isEditorVisible]);

  // Riattiva i listener quando l'editor diventa visibile
  useEffect(() => {
    if (isEditorVisible) {
      reactivatePolygonListeners();
    }
  }, [isEditorVisible]);

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

  // Funzione per disabilitare l'editing di tutti i poligoni
  const disableAllEditing = () => {
    editablePolygons.forEach((polygon) => {
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
    });
  };

  // Funzione per disabilitare l'editing E rimuovere tutti i listener di click
  const disableAllEditingAndListeners = () => {
    editablePolygons.forEach((polygon) => {
      // Disabilita l'editing
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
      // Rimuovi tutti i listener di click
      polygon.off("click");
    });

    // Rimuovi i listener anche dai poligoni esistenti sulla mappa
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        layer.off("click");
      }
    });

    console.log("🔒 Tutti i listener di editing rimossi");
  };

  // Funzione per riattivare i listener sui poligoni esistenti
  const reactivatePolygonListeners = () => {
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
  };

  const toggleEditorVisibility = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  return (
    <>
      {children}

      <button
        onClick={toggleEditorVisibility}
        style={{
          visibility: !isEditorVisible ? "visible" : "hidden",
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Attiva Editor
      </button>

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
        <button
          onClick={toggleEditorVisibility}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "25px",
            height: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            padding: 0,
            zIndex: 1001,
          }}
        >
          X
        </button>

        <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools 3</h2>

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

        <button
          onClick={disableAllEditing}
          style={{
            padding: "10px",
            color: "white",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            marginTop: "10px",
          }}
        >
          ✋ Disabilita Editing
        </button>
      </div>
    </>
  );
};

export default LeafletEditTools;
