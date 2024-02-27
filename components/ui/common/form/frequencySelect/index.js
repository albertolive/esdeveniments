import Select from "react-select";
import { useState } from "react";

const borderColor = "#D1D5DB !important";

const customStyles = {
  container: (provided) => ({
    ...provided,
    borderColor: borderColor,
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderColor:
      state.isFocused || state.isSelected ? borderColor : borderColor,
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: state.isFocused ? borderColor : borderColor,
    borderColor:
      state.isFocused || state.isSelected ? borderColor : borderColor,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const options = [
  { value: "WEEKLY", label: "Cada setmana" },
  { value: "MONTHLY", label: "Cada mes" },
  { value: "YEARLY", label: "Cada any" },
];

export default function FrequencySelect({ id, value, title, onChange }) {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleChange = (value) => {
    if (!value) {
      setSelectedOption(null);
      onChange({ value: "", label: null });
      return;
    }

    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-semibold text-gray-700"
      >
        {title}
      </label>
      <div className="mt-1 select-container">
        <Select
          id={id}
          instanceId={id}
          placeholder=" "
          defaultValue={selectedOption}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          isClearable
        />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Vols més opcions? Posa&apos;t en contacte a{" "}
        <a
          className="hover:text-[#ECB84A]"
          href="mailto:hola@esdeveniments.cat"
        >
          hola@esdeveniments.cat
        </a>{" "}
        i t&apos;ajudarem.
      </div>
    </div>
  );
}
