import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { TOWNS, BYDATES, REGIONS } from "@utils/constants";

const AdArticle = dynamic(() => import("@components/ui/adArticle"), {
  loading: () => "",
  ssr: false,
});

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
  ssr: false,
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

export default function SubMenu() {
  const { push, query } = useRouter();
  const { region, town, byDate } = query;
  const initialTownValue = TOWNS.find(
    (townOption) => townOption.value === town
  );
  const initialByDateValue = BYDATES.find(
    (byDateOption) => byDateOption.value === byDate
  );
  const initialRegionValue = REGIONS.find(
    (regionOption) => regionOption.value === region
  );

  return (
    <>
      <div className="flex justify-center my-4">
        <div className="w-full px-2">
          <Select
            options={REGIONS}
            value={initialRegionValue}
            onChange={({ value = "/" }) => push(`/${value}`)}
          />
        </div>
        <div className="w-full px-2">
          <Select
            options={TOWNS}
            value={initialTownValue}
            onChange={({ value = `/${region}` }) => push(`/${region}/${value}`)}
            isDisabled={!initialRegionValue}
          />
        </div>
        <div className="w-full px-2">
          <Select
            options={BYDATES}
            value={initialByDateValue}
            onChange={({ value }) => push(`/${region}/${town}/${value}`)}
            isDisabled={!initialByDateValue}
          />
        </div>
      </div>
      <div className="min-h-[325px] lg:min-h-[100px]">
        <AdArticle slot="6387726014" />
      </div>
    </>
  );
}
