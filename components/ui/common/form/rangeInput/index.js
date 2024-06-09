import XIcon from "@heroicons/react/outline/XIcon";

const RangeInput = ({
  id,
  name,
  min,
  max,
  value,
  onChange,
  label,
  disabled,
}) => {
  return (
    <div id={id} name={name} className="w-full flex flex-col gap-3">
      <div className="flex justify-start items-center gap-2">
        <label htmlFor={id}>{label}</label>
        <div className="text-primary font-semibold font-barlow text-lg pb-0.5">
          {value} km
        </div>
        {value && (
          <XIcon
            className="w-5 h-5 text-primary"
            aria-hidden="true"
            onClick={() => onChange({ target: { value: "" } })}
          />
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default RangeInput;
