import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import FiltersModal from "@components/ui/filtersModal";

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
  noSSR: false,
});

export default function SubMenu({
  place: placeProps,
  setPlace,
  byDate: byDateProps,
  setByDate,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const {
    query: { place: placeQuery, byDate: byDateQuery },
  } = useRouter();
  const place = placeProps || placeQuery;
  const byDate = byDateProps || byDateQuery;

  const regionsAndCitiesArray = useMemo(
    () => generateRegionsAndTownsOptions(),
    []
  );

  useEffect(() => {
    if (place) {
      const regionOption = regionsAndCitiesArray
        .flatMap((group) => group.options)
        .find((option) => option.value === place);
      setSelectedOption(regionOption || null);
    }
  }, [place, regionsAndCitiesArray]);

  const handlePlaceChange = ({ value }) => {
    setPlace(value);
    setSelectedOption(value);

    localStorage.removeItem("currentPage");
    localStorage.removeItem("scrollPosition");
  };

  const handleByDateChange = (value) => {
    setByDate(value);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center my-4">
        <div className="w-11/12 p-2">
          <Select
            id="options"
            options={regionsAndCitiesArray}
            value={selectedOption}
            onChange={handlePlaceChange}
            isClearable
            placeholder="una localitat"
          />
        </div>
        <div className="w-full flex justify-end items-center cursor-pointer">
          <button
            onClick={() => {
              setOpenModal(true);
            }}
            type="button"
            className="flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl py-3 px-6 ease-in-out duration-300 border border-darkCorp font-barlow italic uppercase font-semibold tracking-wide focus:outline-none hover:bg-primary hover:border-whiteCorp hover:text-whiteCorp"
          >
            <AdjustmentsIcon className="w-5 h-5" aria-hidden="true" />
            <p className="font-barlow hidden sm:block ">Editar</p>
          </button>
        </div>
        {openModal && (
          <FiltersModal openModal={openModal} setOpenModal={setOpenModal} />
        )}
      </div>
    </>
  );
}
