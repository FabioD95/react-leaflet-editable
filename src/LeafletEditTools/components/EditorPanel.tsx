import React from "react";
import L from "leaflet";
import DisableEditor from "../Buttons/DisableEditor";
import CreateEditablePolygon from "../Buttons/CreateEditablePolygon";
import DisableAllEditing from "../Buttons/DisableAllEditing";
import DeletePolygon from "../Buttons/DeletePolygon";
import { EDITOR_PANEL_STYLES } from "../constants/styles";

interface EditorPanelProps {
  isVisible: boolean;
  setIsEditorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  map: L.Map;
  editablePolygons: L.Polygon[];
  setEditablePolygons: React.Dispatch<React.SetStateAction<L.Polygon[]>>;
  currentEditingPolygon: L.Polygon | null;
  setCurrentEditingPolygon: React.Dispatch<
    React.SetStateAction<L.Polygon | null>
  >;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  isVisible,
  setIsEditorVisible,
  map,
  editablePolygons,
  setEditablePolygons,
  currentEditingPolygon,
  setCurrentEditingPolygon,
}) => {
  return (
    <div
      style={{
        visibility: isVisible ? "visible" : "hidden",
        ...EDITOR_PANEL_STYLES,
      }}
    >
      <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools</h2>
      <DisableEditor setIsEditorVisible={setIsEditorVisible} />
      <CreateEditablePolygon map={map} />
      <DisableAllEditing editablePolygons={editablePolygons} />
      <DeletePolygon
        setEditablePolygons={setEditablePolygons}
        currentEditingPolygon={currentEditingPolygon}
        setCurrentEditingPolygon={setCurrentEditingPolygon}
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
        <p>Poligoni totali: {editablePolygons.length}</p>
        <p>In editing: {currentEditingPolygon ? "1" : "0"}</p>
        {currentEditingPolygon && (
          <p style={{ color: "#007bff", fontWeight: "bold" }}>
            ✏️ Poligono selezionato per editing
          </p>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
