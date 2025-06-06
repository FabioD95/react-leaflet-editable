import type { Map } from "leaflet";

const CreateEditablePolygon = ({ map }: { map: Map }) => {
  const createEditablePolygon = () => {
    if (!map.editTools) return;

    map.editTools.startPolygon();
  };
  return (
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
  );
};

export default CreateEditablePolygon;
