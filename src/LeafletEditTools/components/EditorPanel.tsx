import React from "react";
import L from "leaflet";
import DisableEditor from "../Buttons/DisableEditor";
import CreateEditablePolygon from "../Buttons/CreateEditablePolygon";
import DisableAllEditing from "../Buttons/DisableAllEditing";
import { EDITOR_PANEL_STYLES } from "../constants/styles";

interface EditorPanelProps {
  isVisible: boolean;
  setIsEditorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  map: L.Map;
  editablePolygons: L.Polygon[];
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  isVisible,
  setIsEditorVisible,
  map,
  editablePolygons,
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
    </div>
  );
};

export default EditorPanel;
