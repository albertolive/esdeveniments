import { useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BYDATES, CITIES_DATA } from "@utils/constants";
import {
  generateRegionsOptions,
  generateTownsOptions,
  generateDatesOptions,
  generateRegionsAndTownsOptions,
} from "@utils/helpers";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  noSSR: false,
});

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
  noSSR: false,
});

export default function SubMenu({
  region: regionProps,
  setRegion,
  town: townProps,
  setTown,
  setByDate,
}) {
  const {
    query: { region: regionQuery, town: townQuery, byDate },
  } = useRouter();

  const region = regionProps || regionQuery;
  const town = townProps || townQuery;

  const regionsAndCitiesArray = useMemo(() => generateRegionsAndTownsOptions(), [])

  const initialRegionObject = useMemo(() => {
    if (region) {
      const regionOption = regionsAndCitiesArray
        .flatMap((group) => group.options)
        .find((option) => option.value === region);
      return regionOption || null;
    }
    return null;
  }, [region, regionsAndCitiesArray]);

  const initialTownObject = useMemo(() => {
    if (region && town) {
      const townData = CITIES_DATA.get(region).towns.get(town);
      return { value: town, label: townData.label };
    }
    return null;
  }, [region, town]);

  const initialByDateValue = useMemo(
    () => generateDatesOptions(byDate),
    [byDate]
  );

  const handleRegionChange = ({ value }) => {
    setRegion(value);

    if (!value) {
      setTown(undefined);
      setByDate(undefined);
    }
  };

  const handleTownChange = ({ value }) => {
    setTown(value);

    if (!value) {
      setByDate(undefined);
    }
  };

  const handleByDateChange = ({ value }) => {
    setByDate(value);
  };

  return (
    <>
      <div className="flex justify-center my-4 flex-col xs:flex-row">
        <div className="w-full p-2">
          <Select
            id="options"
            options={regionsAndCitiesArray}
            value={initialRegionObject}
            onChange={handleRegionChange}
            isClearable
            placeholder="una opció"
          />
        </div>
        <div className="w-full p-2">
          <Select
            id="dates"
            options={BYDATES}
            value={initialByDateValue}
            onChange={handleByDateChange}
            isDisabled={!initialTownObject}
            isClearable
          />
        </div>
      </div>
      <div className="min-h-[325px] lg:min-h-[100px]">
        <AdArticle slot="6387726014" />
      </div>
    </>
  );
}
