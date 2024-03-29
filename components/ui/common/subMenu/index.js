import { useMemo, useState, useEffect, memo, useRef } from "react";
import dynamic from "next/dynamic";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import Filters from "@components/ui/filters";
import useOnScreen from "@components/hooks/useOnScreen";

const FiltersModal = dynamic(() => import("@components/ui/filtersModal"), {
  loading: () => "",
});

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
  const filtersModalRef = useRef();
  const [selectedOption, setSelectedOption] = useState(null);
  const isFiltersModalVisible = useOnScreen(filtersModalRef);

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
      {openModal && (
        <div
          className="flex justify-center items-center gap-3"
          ref={filtersModalRef}
        >
          {isFiltersModalVisible && (
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
      )}
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
