import { DISABLE_EDITOR_BUTTON_STYLES } from "../constants/styles";

const DisableEditor = ({
  setIsEditorVisible,
}: {
  setIsEditorVisible: (isEditorVisible: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setIsEditorVisible(false)}
      style={DISABLE_EDITOR_BUTTON_STYLES}
    >
      X
    </button>
  );
};

export default DisableEditor;
