// patientViewModels/videocall/AppBuilderWrapper.tsx
import AgoraAppBuilder from "@appbuilder/react";

const AppBuilderWrapper = () => {
  return (
    <div style={{ display: "flex", width: "100%", height: "550px" }}>
      <AgoraAppBuilder.View />
    </div>
  );
};

export default AppBuilderWrapper;