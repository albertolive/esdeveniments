import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

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

const Input = ({ autoComplete, ...props }) => (
  <components.Input {...props} autoComplete="new-password" />
);

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

  useEffect(() => {
    setSelectedOption(initialValue);
  }, [initialValue]);

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value || "");

    if (value === null) {
      localStorage.removeItem("currentPage");
      localStorage.removeItem("scrollPosition");
    }
  };

  return (
    <div className="">
      <label htmlFor="first-name" className="text-blackCorp">
        {title}
      </label>
      <div className="p-2">
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
          components={{
            Input,
          }}
        />
      </div>
    </div>
  );
}
