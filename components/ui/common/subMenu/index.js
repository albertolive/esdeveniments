import { useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BYDATES } from "@utils/constants";
import {
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

const RenderButton = ({ value, label, goTo, byDate }) => {
  const isActiveLink = byDate === value ? "bg-[#ECB84A]" : "bg-gray-800";

  return (
    <button
      className={`relative inline-flex items-center px-4 mx-1 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white ${isActiveLink} lg:hover:bg-yellow-400 focus:outline-none`}
      type="button"
      onClick={() => goTo(value)}
    >
      {label}
    </button>
  );
};

export default function SubMenu({
  place: placeProps,
  setPlace,
  byDate: byDateProps,
  setByDate,
}) {
  const {
    query: { place: placeQuery, byDate: byDateQuery },
  } = useRouter();
  const place = placeProps || placeQuery;
  const byDate = byDateProps || byDateQuery;

  console.log(place, byDate);
  const regionsAndCitiesArray = useMemo(
    () => generateRegionsAndTownsOptions(),
    []
  );

  const initialRegionObject = useMemo(() => {
    if (place) {
      const regionOption = regionsAndCitiesArray
        .flatMap((group) => group.options)
        .find((option) => option.value === place);
      return regionOption || null;
    }
    return null;
  }, [place, regionsAndCitiesArray]);

  const handleRegionChange = ({ value }) => {
    setPlace(value);

    if (byDate) {
      window.history.pushState(
        null,
        null,
        value ? `/${value}/${byDate}` : `/${byDate}`
      );
    } else {
      window.history.pushState(null, null, value ? `/${value}` : "/");
    }

    // if (!value) {
    //   setByDate(undefined);
    // }
  };

  const handleByDateChange = (value) => {
    if (value === byDate) {
      setByDate(undefined);
      window.history.pushState(null, null, place ? `/${place}` : "/");
    } else {
      setByDate(value);
      window.history.pushState(
        null,
        null,
        place && value
          ? `/${place}/${value}`
          : place
          ? `/${place}`
          : `/${value}`
      );
    }
  };

  return (
    <>
      <div className="flex justify-center my-4 flex-col">
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
        <div className="flex justify-center my-4">
          {BYDATES.map(({ value, label }) => (
            <RenderButton
              key={value}
              value={value}
              label={label}
              goTo={handleByDateChange}
              byDate={byDate}
            />
          ))}
        </div>
      </div>
      <div className="min-h-[325px] lg:min-h-[100px]">
        <AdArticle slot="6387726014" />
      </div>
    </>
  );
}
