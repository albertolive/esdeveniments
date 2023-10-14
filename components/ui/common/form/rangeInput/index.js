import React from "react";

const RangeInput = ({ key, id, name, min, max, value, onChange, label }) => {
  return (
    <div key={key} id={id} name={name} className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      <div className="text-sm text-primary">{value} km</div>
    </div>
  );
};

export default RangeInput;
