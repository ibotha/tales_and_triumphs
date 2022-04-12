import { FunctionComponent } from "react";
import "./structure.scss";

type Props = {
  close: () => void;
};

const ModalComponent: FunctionComponent<Props> = ({ close, children }) => {
  return (
    <div className="modal" onClick={close}>
      <div
        className="modal-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalComponent;
