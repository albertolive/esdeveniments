import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BYDATES, CITIES_DATA } from "@utils/constants";
import { useMemo } from "react";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  ssr: false,
});

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
  ssr: false,
});

function generateRegionsOptions() {
  return [...CITIES_DATA.entries()].map(([regionKey, region]) => ({
    value: regionKey,
    label: region.label,
  }));
}

function generateTownsOptions(region) {
  return region
    ? [...CITIES_DATA.get(region)?.towns.entries()].map(([townKey, town]) => ({
        value: townKey,
        label: town.label,
      }))
    : [];
}

function generateDatesOptions(byDate) {
  return byDate
    ? BYDATES.filter((byDateOption) => byDateOption.value === byDate)
    : [];
}

export default function SubMenu() {
  const {
    push,
    query: { region, town, byDate },
  } = useRouter();

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

  const handleRegionChange = ({ value = "/" }) => {
    push(`/${value}`);
  };

  const handleTownChange = ({ value }) => {
    push(value ? `/${region}/${value}` : `/${region}`);
  };

  const handleByDateChange = ({ value }) => {
    push(value ? `/${region}/${town}/${value}` : `/${region}/${town}`);
  };

  return (
    <>
      <div className="flex justify-center my-4">
        <div className="w-full px-2">
          <Select
            id="regions"
            options={regionsArray}
            value={initialRegionObject}
            onChange={handleRegionChange}
            isClearable
            placeholder="una comarca"
          />
        </div>
        <div className="w-full px-2">
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
        <div className="w-full px-2">
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
