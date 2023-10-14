import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";

const renderButton = ({ text, enabled, onClick }) => (
  <div key={text} className="flex justify-center items-center py-4">
    <button
      className={`flex justify-center items-center gap-2 text-sm bg-whiteCorp rounded-xl py-1 px-3 ease-in-out duration-300 border focus:outline-none font-barlow italic uppercase font-semibold ${
        enabled ? "border-primary text-primary" : "border-bColor text-bColor"
      }`}
      onClick={onClick}
    >
      <span className="uppercase tracking-wide">{text}</span>
      {enabled ? (
        <XIcon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  </div>
);

const Filters = ({
  openModal,
  setOpenModal,
  byDate,
  setByDate,
  category,
  setCategory,
  distance,
  setDistance,
}) => {
  const foundByDate = byDate && BYDATES.find((item) => item.value === byDate);

  const handleByDateClick = useCallback(() => setByDate(""), [setByDate]);
  const handleCategoryClick = useCallback(() => setCategory(""), [setCategory]);
  const handleDistanceClick = useCallback(() => setDistance(""), [setDistance]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full flex flex-col justify-center items-center cursor-pointer gap-1">
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          type="button"
          className="w-full flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl py-2 px-6 ease-in-out duration-300 border border-bColor focus:outline-none font-barlow italic uppercase font-semibold"
        >
          <AdjustmentsIcon className="w-4 h-4" aria-hidden="true" />
          <p className="font-barlow">Filtres</p>
        </button>
        <div className="w-full flex justify-between items-center overflow-x-auto">
          {renderButton({
            text: category ? category : "Categories",
            enabled: category,
            onClick: category ? handleCategoryClick : () => setOpenModal(true),
          })}
          {renderButton({
            text: foundByDate ? foundByDate.label : "Data",
            enabled: foundByDate,
            onClick: foundByDate ? handleByDateClick : () => setOpenModal(true),
          })}
          {renderButton({
            text: distance ? distance + " kms" : "Distància",
            enabled: distance,
            onClick: distance ? handleDistanceClick : () => setOpenModal(true),
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
