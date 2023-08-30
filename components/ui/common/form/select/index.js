import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  container: (provided) => ({
    ...provided,
    borderColor: "#FFF !important",
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
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
    color: "#BBB",
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

export default function SelectComponent({
  id,
  title,
  value: initialValue = null,
  onChange,
  options = [],
  isDisabled = false,
  isValidNewOption = false,
  isClearable = false,
  placeholder = "una opció",
}) {
  const [selectedOption, setSelectedOption] = useState(initialValue);

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value || "");
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block font-medium text-gray-700"
      >
        {title}
      </label>
      <div className="mt-1 select-container">
        <CreatableSelect
          id={id}
          instanceId={id}
          isSearchable
          isClearable={isClearable}
          autoComplete
          formatCreateLabel={(inputValue) => `Afegir nou lloc: "${inputValue}"`}
          placeholder={`Selecciona ${placeholder}`}
          defaultValue={selectedOption || initialValue}
          value={selectedOption || initialValue}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          isDisabled={isDisabled}
          isValidNewOption={() => isValidNewOption}
          noOptionsMessage={() => "No s'ha trobat cap opció"}
        />
      </div>
    </div>
  );
}
