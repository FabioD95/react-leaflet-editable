import { ENABLE_EDITOR_BUTTON_STYLES } from "../constants/styles";

const EnableEditor = ({
  isEditorVisible,
  setIsEditorVisible,
}: {
  isEditorVisible: boolean;
  setIsEditorVisible: (isEditorVisible: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setIsEditorVisible(true)}
      style={{
        ...ENABLE_EDITOR_BUTTON_STYLES,
        visibility: !isEditorVisible ? "visible" : "hidden",
      }}
    >
      Attiva Editor
    </button>
  );
};

export default EnableEditor;
