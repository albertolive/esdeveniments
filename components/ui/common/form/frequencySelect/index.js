import Select from "react-select";
import { useState } from "react";

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    borderColor: "#D1D5DB !important",
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
    boxShadow: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  singleValue: (provided, state) => ({
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
        className="block text-sm font-medium text-gray-700"
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
          href="mailto:hola@culturacardedeu.com"
        >
          hola@culturacardedeu.com
        </a>{" "}
        i t&apos;ajudarem.
      </div>
    </div>
  );
}
