import { FunctionComponent } from "react";

type Props = {
  yes: () => void;
  no: () => void;
};

const ConfirmComponent: FunctionComponent<Props> = ({ yes, no }) => {
  return (
    <div>
      <slot>Are you sure?</slot>
      <div
        style={{ display: "flex", gap: "1em", justifyContent: "space-around" }}
      >
        <div className="btn" onClick={yes}>
          Yes
        </div>
        <div className="btn" onClick={no}>
          No
        </div>
      </div>
    </div>
  );
};

export default ConfirmComponent;
