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
    <div id={id} name={name} className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-start items-center gap-2">
        <label htmlFor={id}>{label}</label>
        <div className="flex justify-start items-center text-primary gap-2 font-semibold font-barlow text-lg pb-1">
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
