import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

const customStyles = {
  container: (provided) => ({
    ...provided,
    borderColor: "#FFF !important",
    border:"0px",
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "16px",
    borderColor: state.isSelected ? "#CCC !important" : "#CCC !important",
    borderColor: state.isFocused ? "#CCC !important" : "#CCC !important",
    padding: "0px 15px",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isSelected ? "#FFF !important" : "#FFF !important",
    borderColor: state.isFocused ? "#FFF !important" : "#FFF !important",
    boxShadow: state.isFocused ? "#000 !important" : "#CCC !important",
    borderRadius: "0px",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "16px",
    color: "#CCC",
    padding: "0px 15px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "16px",
    background: state.isFocused ? "#FF0037" : "#FFF",
    color: state.isFocused ? "#FFF" : "#454545",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "16px",
    color: "#454545",
  }),
  menu: (provided) => ({
    ...provided,
    border: "0px",
    borderRadius: "0px",
    boxShadow: "0px 10px 30px -25px #454545",
    background: "#FFF",
    padding: "0px 10px 30px",
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
    <div className="w-full">
      <label htmlFor="first-name" className="text-blackCorp">
        {title}
      </label>
      <div>
        <CreatableSelect
          className="border-0"
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
