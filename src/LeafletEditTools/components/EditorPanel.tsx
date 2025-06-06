import React from "react";
import L from "leaflet";
import DisableEditor from "../Buttons/DisableEditor";
import CreateEditablePolygon from "../Buttons/CreateEditablePolygon";
import DisableAllEditing from "../Buttons/DisableAllEditing";
import DeletePolygon from "../Buttons/DeletePolygon";
import SavePolygons from "../Buttons/SavePolygons";
import { EDITOR_PANEL_STYLES } from "../constants/styles";
import type { PolygonState } from "../types";

interface EditorPanelProps {
  isVisible: boolean;
  setIsEditorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  map: L.Map;
  editablePolygons: L.Polygon[];
  currentEditingPolygon: L.Polygon | null;
  polygonStates: Map<L.Polygon, PolygonState>;
  removePolygon: (polygon: L.Polygon) => void;
  getChangedPolygons: () => L.Polygon[];
  resetModificationFlags: () => void;
  onSavePolygons?: (polygons: L.LatLng[][]) => Promise<void> | void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  isVisible,
  setIsEditorVisible,
  map,
  editablePolygons,
  currentEditingPolygon,
  polygonStates,
  removePolygon,
  getChangedPolygons,
  resetModificationFlags,
  onSavePolygons,
}) => {
  const changedPolygons = getChangedPolygons();
  const newCount = Array.from(polygonStates.values()).filter(
    (s) => s.isNew
  ).length;
  const modifiedCount = Array.from(polygonStates.values()).filter(
    (s) => s.isModified
  ).length;

  return (
    <div
      style={{
        visibility: isVisible ? "visible" : "hidden",
        ...EDITOR_PANEL_STYLES,
      }}
    >
      <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools</h2>
      <DisableEditor setIsEditorVisible={setIsEditorVisible} />

      {/* Sezione di creazione e modifica */}
      <CreateEditablePolygon map={map} />
      <DisableAllEditing editablePolygons={editablePolygons} />
      <DeletePolygon
        removePolygon={removePolygon}
        currentEditingPolygon={currentEditingPolygon}
      />

      {/* Separatore visivo */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#ddd",
          margin: "10px 0",
        }}
      />

      {/* Sezione di salvataggio */}
      <SavePolygons
        getChangedPolygons={getChangedPolygons}
        resetModificationFlags={resetModificationFlags}
        polygonStates={polygonStates}
        onSavePolygons={onSavePolygons}
      />

      {/* Info sui poligoni */}
      <div
        style={{
          fontSize: "12px",
          color: "#666",
          width: "100%",
          marginTop: "auto",
        }}
      >
        <p>
          📊 <strong>Statistiche:</strong>
        </p>
        <p>• Poligoni totali: {editablePolygons.length}</p>
        <p>• In editing: {currentEditingPolygon ? "1" : "0"}</p>
        <p>
          • Nuovi:{" "}
          <span style={{ color: newCount > 0 ? "#4CAF50" : "#666" }}>
            {newCount}
          </span>
        </p>
        <p>
          • Modificati:{" "}
          <span style={{ color: modifiedCount > 0 ? "#FF9800" : "#666" }}>
            {modifiedCount}
          </span>
        </p>
        <p>
          • Da salvare:{" "}
          <span
            style={{ color: changedPolygons.length > 0 ? "#007bff" : "#666" }}
          >
            {changedPolygons.length}
          </span>
        </p>

        {currentEditingPolygon && (
          <p
            style={{ color: "#007bff", fontWeight: "bold", marginTop: "10px" }}
          >
            ✏️ Poligono selezionato per editing
          </p>
        )}
        {onSavePolygons && (
          <p style={{ color: "#4CAF50", fontSize: "10px", marginTop: "10px" }}>
            ✓ Funzione di salvataggio configurata
          </p>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
