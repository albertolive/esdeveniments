const { memo } = require("react");

const RadioInput = ({
  id,
  name,
  value,
  checkedValue,
  onChange,
  label,
  disabled,
}) => {
  return (
    <div className="flex pb-4">
      <input
        id={id}
        name={name}
        type="radio"
        className="form-radio h-5 w-5 text-primary focus:outline-none focus:ring-0 focus:ring-whiteCorp"
        checked={checkedValue === value}
        onClick={() => onChange(value)}
        readOnly
        disabled={disabled}
      />
      <label htmlFor={id} className="ml-3 text-sm">
        {label}
      </label>
    </div>
  );
};

export default memo(RadioInput);
