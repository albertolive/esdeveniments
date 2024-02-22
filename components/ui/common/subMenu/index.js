import { useMemo, useState, useEffect, memo } from "react";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import FiltersModal from "@components/ui/filtersModal";
import Filters from "@components/ui/filters";

function SubMenu({
  place,
  placeProps,
  setPlace,
  byDate,
  byDateProps,
  setByDate,
  category,
  setCategory,
  searchTerm,
  setSearchTerm,
  userLocation,
  setUserLocation,
  distance,
  setDistance,
  openModal,
  setOpenModal,
  scrollToTop,
  setNavigatedFilterModal,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

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
            setNavigatedFilterModal={setNavigatedFilterModal}
          />
        )}
      </div>
      <Filters
        setOpenModal={setOpenModal}
        place={place}
        placeProps={placeProps}
        setPlace={setPlace}
        byDate={byDate}
        byDateProps={byDateProps}
        setByDate={setByDate}
        category={category}
        setCategory={setCategory}
        distance={distance}
        setDistance={setDistance}
        setSelectedOption={setSelectedOption}
        scrollToTop={scrollToTop}
      />
    </>
  );
}

export default memo(SubMenu);
