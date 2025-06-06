import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import EnableEditor from "./Buttons/EnableEditor";
import EditorPanel from "./components/EditorPanel";
import { useLeafletEditable } from "./hooks/useLeafletEditable";
import { useEditorVisibility } from "./hooks/useEditorVisibility";
import L from "leaflet";

interface LeafletEditToolsProps {
  children: React.ReactNode;
  onSavePolygons?: (polygons: L.LatLng[][]) => Promise<void> | void;
}

const LeafletEditTools = ({
  children,
  onSavePolygons,
}: LeafletEditToolsProps) => {
  const map = useMap();

  const {
    editablePolygons,
    currentEditingPolygon,
    polygonStates,
    addExistingPolygon,
    removePolygon,
    getChangedPolygons,
    resetModificationFlags,
    disableAllEditingAndListeners,
    enablePolygonEditing,
    reactivatePolygonListeners,
    addNewPolygon,
  } = useLeafletEditable(map);

  const { isEditorVisible, setIsEditorVisible } = useEditorVisibility(
    map,
    disableAllEditingAndListeners,
    enablePolygonEditing,
    addNewPolygon
  );

  // Funzione per rendere editabili i poligoni esistenti
  useEffect(() => {
    if (!map || !map.editTools || !isEditorVisible) return;

    const registerExistingPolygon = (layer: L.Polygon) => {
      if (!editablePolygons.includes(layer)) {
        layer.off("click");
        layer.on("click", () => {
          enablePolygonEditing(layer);
        });
        addExistingPolygon(layer); // Usa la nuova funzione per poligoni esistenti
      }
    };

    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        registerExistingPolygon(layer);
      }
    });
  }, [
    map,
    editablePolygons,
    isEditorVisible,
    enablePolygonEditing,
    addExistingPolygon,
  ]);

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
      <EditorPanel
        isVisible={isEditorVisible}
        setIsEditorVisible={setIsEditorVisible}
        map={map}
        editablePolygons={editablePolygons}
        currentEditingPolygon={currentEditingPolygon}
        polygonStates={polygonStates}
        removePolygon={removePolygon}
        getChangedPolygons={getChangedPolygons}
        resetModificationFlags={resetModificationFlags}
        onSavePolygons={onSavePolygons}
      />
    </>
  );
};

export default LeafletEditTools;
