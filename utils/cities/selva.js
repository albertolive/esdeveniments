import {siteUrl} from "@config/index";

const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const selva = [
  "selva",
  {
    label: "Selva",
    towns: new Map([
      [
        "amer",
        {
          label: "Amer",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=amer`,
          postalCode: "17170",
          coords: { lat: 42.01014321520421, lng: 2.601112454161817 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "brunyola",
        {
          label: "Brunyola",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=brunyola`,
          postalCode: "17441",
          coords: { lat: 41.90433123125433, lng: 2.6844513842053415 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "fogars-de-la-selva",
        {
          label: "Fogars de la Selva",
          rssFeed: "https://www.fogarsdelaselva.cat/rss/12",
          postalCode: "08495",
          coords: { lat: "41.7339", lng: "2.6741" },
          ...sharedData,
        },
      ],
      [
        "riudarenes",
        {
          label: "Riuadrenes",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=riudarenes`,
          postalCode: "17421",
          coords: { lat: 41.82390619969425, lng: 2.716193163543463 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "riudellots-de-la-selva",
        {
          label: "Riudellots de la Selva",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=riudellots-de-la-selva`,
          postalCode: "17457",
          coords: { lat: 41.9018115982014, lng: 2.80254227832728 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "sant-hilari-sacalm",
        {
          label: "Sant Hilari Sacalm",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=sant-hilari-sacalm`,
          postalCode: "17403",
          coords: { lat: 41.878838900571715, lng: 2.5112221854007535 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "susqueda",
        {
          label: "Susqueda",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=susqueda`,
          postalCode: "17166",
          coords: { lat: 42.04051449860147, lng: 2.505313638592133 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "vidreres",
        {
          label: "Vidreres",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=vidreres`,
          postalCode: "17411",
          coords: { lat: 41.78881689148823, lng: 2.779212932821845 },
          getDescriptionFromRss: true,
        },
      ],
    ]),
  },
];

export default selva;
