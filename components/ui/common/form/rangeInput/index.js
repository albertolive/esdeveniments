import React, { useState } from "react";
import XIcon from "@heroicons/react/outline/XIcon";


const RangeInput = ({ key, id, name, min, max, value, onChange, label }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleEnable = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div key={key} id={id} name={name} className="w-full flex flex-col space-y-2">
      <div className="flex justify-start items-center gap-2">
        <label htmlFor={id}>
          {label}
        </label>
        <div className="text-primary font-medium font-barlow text-lg pb-1">
          {value} km
        </div>
        {value && <XIcon className="w-4 h-4" aria-hidden="true" onClick={toggleEnable} />}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        disabled={!isEnabled}
      />
    </div>
  );
};

export default RangeInput;
