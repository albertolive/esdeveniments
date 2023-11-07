import { useMemo, useState, useEffect, memo } from "react";
import { useRouter } from "next/router";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import FiltersModal from "@components/ui/filtersModal";
import Filters from "@components/ui/filters";

function SubMenu({
  place: placeProps,
  setPlace,
  byDate: byDateProps,
  setByDate,
  category,
  setCategory,
  searchTerm,
  setSearchTerm,
  userLocation,
  setUserLocation,
  distance,
  setDistance,
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
    } else {
      setSelectedOption(undefined);
    }
  }, [place, regionsAndCitiesArray]);

  return (
    <>
      <div className="flex justify-center items-center gap-3">
        {openModal && (
          <FiltersModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            place={place}
            setPlace={setPlace}
            byDate={byDate}
            setByDate={setByDate}
            category={category}
            setCategory={setCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            distance={distance}
            setDistance={setDistance}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        )}
      </div>
      <Filters
        setOpenModal={setOpenModal}
        place={place}
        setPlace={setPlace}
        byDate={byDate}
        setByDate={setByDate}
        category={category}
        setCategory={setCategory}
        distance={distance}
        setDistance={setDistance}
        setSelectedOption={setSelectedOption}
      />
    </>
  );
}

export default memo(SubMenu);
