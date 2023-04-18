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

export default function SubMenu() {
  const { push, query } = useRouter();
  const { region, town, byDate } = query;
  const initialRegionValue = REGIONS.find(
    (regionOption) => regionOption.value === region
  );
  const initialTownValue = TOWNS.find(
    (townOption) => townOption.value === town
  );
  const initialByDateValue = BYDATES.find(
    (byDateOption) => byDateOption.value === byDate
  );

  return (
    <>
      <div className="flex justify-center my-4">
        <div className="w-full px-2">
          <Select
            id="regions"
            options={REGIONS}
            value={initialRegionValue}
            onChange={({ value = "/" }) => push(`/${value}`)}
            isClearable
            placeholder="una comarca"
          />
        </div>
        <div className="w-full px-2">
          <Select
            id="towns"
            options={TOWNS}
            value={initialTownValue}
            onChange={({ value }) =>
              push(value ? `/${region}/${value}` : `/${region}`)
            }
            isDisabled={!initialRegionValue}
            isClearable
            placeholder="un poble"
          />
        </div>
        <div className="w-full px-2">
          <Select
            id="dates"
            options={BYDATES}
            value={initialByDateValue}
            onChange={({ value }) =>
              push(value ? `/${region}/${town}/${value}` : `/${region}/${town}`)
            }
            isDisabled={!initialTownValue}
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
