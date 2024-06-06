import { useMemo, useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import Filters from "@components/ui/filters";
import useOnScreen from "@components/hooks/useOnScreen";
import { useFilters } from "@components/hooks/useFilters";

const FiltersModal = dynamic(() => import("@components/ui/filtersModal"), {
  loading: () => "",
});

function SubMenu() {
  const { state, setOpenModal } = useFilters();
  const filtersModalRef = useRef();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const isFiltersModalVisible = useOnScreen(filtersModalRef);

  const regionsAndCitiesArray = useMemo(
    () => generateRegionsAndTownsOptions(),
    []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (state.place) {
      const regionOption = regionsAndCitiesArray
        .flatMap((group) => group.options)
        .find((option) => option.value === state.place);
      setSelectedOption(regionOption || null);
    } else {
      setSelectedOption(undefined);
    }
  }, [state.place, regionsAndCitiesArray]);

  return (
    <>
      {state.openModal && (
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
      {isMounted && (
        <Filters
          setSelectedOption={setSelectedOption}
          scrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
}

export default memo(SubMenu);
