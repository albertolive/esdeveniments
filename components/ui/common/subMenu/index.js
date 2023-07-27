import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BYDATES } from "@utils/constants";
import { generateRegionsAndTownsOptions } from "@utils/helpers";

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
  const [selectedOption, setSelectedOption] = useState(null);
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
  };

  const handleByDateChange = (value) => {
    setByDate(value);
  };

  return (
    <>
      <div className="flex justify-center my-4 flex-col">
        <div className="w-full p-2">
          <Select
            id="options"
            options={regionsAndCitiesArray}
            value={selectedOption}
            onChange={handlePlaceChange}
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
