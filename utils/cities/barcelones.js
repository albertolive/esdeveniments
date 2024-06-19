import { siteUrl } from "@config/index";

const barcelones = [
  "barcelones",
  {
    label: "Barcelonès",
    province: "barcelona",
    towns: new Map([
      [
        "barcelona",
        {
          label: "Barcelona",
          rssFeed: `${siteUrl}/api/scrapeWebsite`,
          descriptionSelector: ".cos",
          imageSelector: ".img-destacada",
          postalCode: "08001",
          coords: { lat: 41.390205, lng: 2.154007 },
          sanitizeUrl: true,
          getDescriptionFromRss: true,
        },
      ],
      [
        "cerdanyola-del-valles",
        {
          label: "Cerdanyola del Vallès",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=cerdanyola-del-valles`,
          postalCode: "08290",
          coords: { lat: 41.491014, lng: 2.140862 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "badalona",
        {
          label: "Badalona",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=badalona`,
          postalCode: "08911",
          coords: { lat: 41.45262481, lng: 2.24625368 },
          getDescriptionFromRss: true,
        },
      ],
    ]),
  },
];

export default barcelones;
