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

  const handleRegionChange = ({ value }) => {
    setPlace(value);
    setSelectedOption(value);

    // Save the state to localStorage
    localStorage.setItem("place", value);
    localStorage.setItem("byDate", byDate);
  };

  const handleByDateChange = (value) => {
    setByDate(value);

    // Save the state to localStorage
    localStorage.setItem("place", place);
    localStorage.setItem("byDate", value);
  };

  // Restore the state from localStorage when the component mounts
  useEffect(() => {
    const place = localStorage.getItem("place");
    const byDate = localStorage.getItem("byDate");

    if (place) {
      setPlace(place);
      const regionOption = regionsAndCitiesArray
        .flatMap((group) => group.options)
        .find((option) => option.value === place);
      setSelectedOption(regionOption || null);
    }

    if (byDate) {
      setByDate(byDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-center my-4 flex-col">
        <div className="w-full p-2">
          <Select
            id="options"
            options={regionsAndCitiesArray}
            value={selectedOption}
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
