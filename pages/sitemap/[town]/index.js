import Meta from "@components/partials/seo-meta";
import { siteUrl } from "@config/index";
import { getAllYears } from "@lib/dates";
import { MONTHS_URL } from "@utils/constants";
import Link from "next/link";

const years = getAllYears();

export default function Sitemap({ town, label }) {
  return (
    <>
      <Meta
        title={`Arxiu. Descobreix tot el que ha passat a ${label} - Esdeveniments.cat`}
        description={`Descobreix tot el què ha passat a ${label} cada any. Les millors propostes culturals per esprémer al màxim de ${town} - Arxiu - Esdeveniments.cat`}
        canonical={`${siteUrl}/sitemap/${town}`}
      />
      <div className="reset-this">
        <h2 className="pb-2">{label}</h2>
      </div>
      <div className="grid overflow-hidden grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-2 grid-flow-row w-auto">
        {years.map((year) => (
          <div key={year} className="box">
            <div className="reset-this">
              <h2 className="pb-2">{year}</h2>
            </div>
            {MONTHS_URL.map((month) => {
              let textMonth = month;
              if (month === "marc") textMonth = month.replace("c", "ç");
              return (
                <div key={`${year}-${month}`} className="box py-1">
                  <Link
                    href={`/sitemap/${town}/${year}/${month.toLocaleLowerCase()}`}
                    prefetch={false}
                  >
                    <a className="hover:underline">
                      <p className="text-md capitalize">{textMonth}</p>
                    </a>
                  </Link>
                </div>
              );
            }).reverse()}
          </div>
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const {
    generateRegionsOptions,
    generateTownsOptions,
  } = require("@utils/helpers");
  const regions = generateRegionsOptions();
  const paths = [];
  for (const region of regions) {
    const towns = generateTownsOptions(region.value);
    for (const town of towns) {
      paths.push({
        params: { town: town.value },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { town } }) {
  const { getTownOptionsWithoutRegion } = require("@utils/helpers");
  const { label } = getTownOptionsWithoutRegion(town);
  return { props: { town, label } };
}
