import type { Map } from "leaflet";
import { CREATE_POLYGON_BUTTON_STYLES } from "../constants/styles";

const CreateEditablePolygon = ({ map }: { map: Map }) => {
  const createEditablePolygon = () => {
    if (!map.editTools) return;

    map.editTools.startPolygon();
  };

  return (
    <button
      onClick={createEditablePolygon}
      style={CREATE_POLYGON_BUTTON_STYLES}
    >
      🖊️ Disegna Poligono Editabile
    </button>
  );
};

export default CreateEditablePolygon;
