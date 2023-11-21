import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";
import { generateRegionsOptions, generateTownsOptions } from "@utils/helpers";
import Link from "next/link";

const regions = generateRegionsOptions();

export default function Sitemap() {
  return <>
    <Meta
      title={`Arxiu. Descobreix tot el que passa a Catalunya - Esdeveniments.cat`}
      description="Descobreix tot el què ha passat a Catalunya cada any. Les millors propostes culturals per esprémer al màxim de Catalunya - Arxiu - Esdeveniments.cat"
      canonical={`${siteUrl}/sitemap`}
    />
    <div className="grid overflow-hidden grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-2 grid-flow-row w-auto">
      {regions.map(({ value, label }) => {
        const towns = generateTownsOptions(value);

        return (
          <div key={value} className="box">
            <div className="reset-this">
              <h2 className="pb-2">{label}</h2>
            </div>
            {towns.map(({ value: valueTown, label: labelTown }) => {
              return (
                <div key={`${valueTown}`} className="box py-1">
                  <Link
                    href={`/sitemap/${labelTown.toLowerCase()}`}
                    prefetch={false}
                    className="hover:underline">

                    <p className="text-md capitalize">{labelTown}</p>

                  </Link>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  </>;
}
