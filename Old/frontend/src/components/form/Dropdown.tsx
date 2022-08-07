import { FunctionComponent, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const Dropdown: FunctionComponent<Props> = ({ options, value, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
      {value}
      {showDropdown ? (
        <div className="dropdown-panel">
          {options.map((o, i) => {
            return (
              <div
                key={i}
                onClick={() => onChange(o)}
                className={o == value ? "selected" : ""}
              >
                {o}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
