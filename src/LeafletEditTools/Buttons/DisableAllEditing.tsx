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
  );
};

export default DisableAllEditing;
