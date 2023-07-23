import { useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BYDATES, CITIES_DATA } from "@utils/constants";
import {
  generateRegionsOptions,
  generateTownsOptions,
  generateDatesOptions,
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

  const regionsArray = useMemo(() => generateRegionsOptions(), []);
  const citiesArray = useMemo(() => generateTownsOptions(region), [region]);

  const initialRegionObject = useMemo(() => {
    if (region) {
      const regionData = CITIES_DATA.get(region);
      return { value: region, label: regionData.label };
    }
    return null;
  }, [region]);

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
    window.history.pushState(null, null, value ? `/${value}` : "/");

    if (!value) {
      setTown(null);
    }
  };

  const handleTownChange = ({ value }) => {
    setTown(value);
    window.history.pushState(
      null,
      null,
      value ? `/${region}/${value}` : `/${region}`
    );
  };

  const handleByDateChange = ({ value }) => {
    setByDate(value);
    window.history.pushState(
      null,
      null,
      value ? `/${region}/${town}/${value}` : `/${region}/${town}`
    );
  };

  return (
    <>
      <div className="flex justify-center my-4 flex-col xs:flex-row">
        <div className="w-full p-2">
          <Select
            id="regions"
            options={regionsArray}
            value={initialRegionObject}
            onChange={handleRegionChange}
            isClearable
            placeholder="una comarca"
          />
        </div>
        <div className="w-full p-2">
          <Select
            id="cities"
            options={citiesArray}
            value={initialTownObject}
            onChange={handleTownChange}
            isDisabled={!initialRegionObject}
            isClearable
            placeholder="un poble"
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
