import { useMemo, useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import Filters from "@components/ui/filters";
import useOnScreen from "@components/hooks/useOnScreen";
import useStore from "@store";

const FiltersModal = dynamic(() => import("@components/ui/filtersModal"), {
  loading: () => "",
});

function SubMenu() {
  const { place, openModal } = useStore((state) => ({
    place: state.place,
    openModal: state.openModal,
  }));

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
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          )}
        </div>
      )}
      <Filters
        setSelectedOption={setSelectedOption}
        scrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </>
  );
}

export default memo(SubMenu);
