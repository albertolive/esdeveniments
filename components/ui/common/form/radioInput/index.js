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
    <div className="flex justify-start items-center gap-4 pb-3">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="h-5 w-5 rounded-md text-primary border border-bColor focus:outline-none focus:ring-0 focus:ring-whiteCorp"
        checked={checkedValue === value}
        onClick={() => onChange(value)}
        readOnly
        disabled={disabled}
      />
      <label htmlFor={id} className="">
        {label}
      </label>
    </div>
  );
};

export default memo(RadioInput);
