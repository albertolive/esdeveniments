const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const llucanes = [
  "llucanes",
  {
    label: "Lluçanès",
    towns: new Map([
      [
        "alpens",
        {
          label: "Alpens",
          rssFeed: "https://www.alpens.cat/rss/12",
          postalCode: "08507",
          coords: { lat: "42.1667", lng: "2.2167" },
          ...sharedData,
        },
      ],
      [
        "lluca",
        {
          label: "Lluçà",
          rssFeed: "https://www.lluca.cat/rss/12",
          postalCode: "08514",
          coords: { lat: "42.0333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "orista",
        {
          label: "Oristà",
          rssFeed: "https://www.orista.cat/rss/12/0/",
          postalCode: "08512",
          coords: { lat: "42", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "perafita",
        {
          label: "Perafita",
          rssFeed: "https://www.perafita.cat/rss/12",
          postalCode: "08506",
          coords: { lat: "42.1333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "sobremunt",
        {
          label: "Sobremunt",
          rssFeed: "https://www.sobremunt.cat/rss/12",
          postalCode: "08506",
          coords: { lat: "42.1333", lng: "2.25" },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default llucanes;
