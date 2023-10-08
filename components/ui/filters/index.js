import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";

const renderButton = ({ text, enabled, onClick }) => (
  <div key={text} className="flex-none">
    <button
      className={`flex items-center border p-2 rounded-md transition-all ease-in-out duration-300 hover:bg-primary font-barlow italic uppercase font-semibold tracking-wide ${
        enabled
          ? "border-primarydark text-primarydark"
          : "border-darkCorp text-blackCorp"
      }`}
      onClick={onClick}
    >
      <span className="capitalize">{text}</span>
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
    <div className="max-w-screen flex px-4 gap-4 overflow-x-auto">
      <div className=" pb-4 w-full flex items-center cursor-pointer space-x-2">
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          type="button"
          className="flex justify-center items-center gap-1 text-blackCorp bg-whiteCorp rounded-md p-2 ease-in-out duration-300 border border-darkCorp font-barlow italic font-semibold tracking-wide focus:outline-none hover:bg-primary hover:border-whiteCorp hover:text-whiteCorp"
        >
          <AdjustmentsIcon className="w-4 h-4" aria-hidden="true" />
          <p className="font-barlow">Filtres</p>
        </button>

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
          text: distance ? distance + " km" : "Distància",
          enabled: distance,
          onClick: distance ? handleDistanceClick : () => setOpenModal(true),
        })}
      </div>
    </div>
  );
};

export default memo(Filters);
