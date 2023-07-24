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

const RenderButton = ({ text, goTo }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isActiveLink = pathname === goTo ? "bg-[#ECB84A]" : "bg-gray-800";

  return (
    <button
      className={`relative inline-flex items-center px-4 mx-1 py-2 border border-transparent shadow-md text-sm font-medium rounded-md text-white ${isActiveLink} hover:bg-yellow-400 focus:outline-none`}
      type="button"
      onClick={() => router.push(goTo)}
    >
      {text}
    </button>
  );
};

export default function SubMenu({
  place: placeProps,
  setPlace,
  setByDate,
}) {
  const {
    query: { place: regionQuery, byDate },
  } = useRouter();

  const place = placeProps || regionQuery;

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

    window.history.pushState(null, null, value ? `/${value}` : "/");

    if (!value) {
      setByDate(undefined);
    }
  };

  const handleByDateChange = ({ value }) => {
    setByDate(value);
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
              text={label}
              goTo={`/${place}/${value}`}
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
