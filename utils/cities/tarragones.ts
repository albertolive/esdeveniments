import { siteUrl } from "@config/index";

const tarragones = [
  "tarragones",
  {
    label: "Tarragonés",
    province: "tarragona",
    towns: new Map([
      [
        "bot",
        {
          label: "Bot",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=bot`,
          postalCode: "43785",
          coords: { lat: 41.009169, lng: 0.38425 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "la-nou-de-gaia",
        {
          label: "La Nou de Gaià",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=la-nou-de-gaia`,
          postalCode: "43763",
          coords: { lat: 41.182941, lng: 1.373928 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "altafulla",
        {
          label: "Altafulla",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=altafulla`,
          postalCode: "43893",
          coords: { lat: 41.142162, lng: 1.37684 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "tarragona",
        {
          label: "Tarragona",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=tarragona`,
          postalCode: "43005",
          coords: { lat: 41.119221, lng: 1.245897 },
          getDescriptionFromRss: true,
        },
      ],
    ]),
  },
];

export default tarragones;
