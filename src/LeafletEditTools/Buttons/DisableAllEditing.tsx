import L from "leaflet";
import { DISABLE_ALL_EDITING_BUTTON_STYLES } from "../constants/styles";

const DisableAllEditing = ({
  editablePolygons,
}: {
  editablePolygons: L.Polygon[];
}) => {
  const disableAllEditing = () => {
    editablePolygons.forEach((polygon) => {
      if (typeof polygon.disableEdit === "function") {
        polygon.disableEdit();
      }
    });
  };

  return (
    <button
      onClick={disableAllEditing}
      style={DISABLE_ALL_EDITING_BUTTON_STYLES}
    >
      ✋ Disabilita Editing
    </button>
  );
};

export default DisableAllEditing;
