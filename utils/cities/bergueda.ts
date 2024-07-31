const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const bergueda = [
  "bergueda",
  {
    label: "Berguedà",
    province: "barcelona",
    towns: new Map([
      [
        "borreda",
        {
          label: "Borreda",
          rssFeed: "https://www.borreda.net/rss/12",
          postalCode: "08619",
          coords: { lat: 42.135661053939, lng: 1.99410132066278 },
          ...sharedData,
        },
      ],
      [
        "castellardenhug",
        {
          label: "Castellar de n'Hug",
          rssFeed: "https://ajcastellardenhug.cat/rss/12",
          postalCode: "08696",
          coords: { lat: 42.2822160900048, lng: 2.01680476070411 },
          ...sharedData,
        },
      ],
      [
        "cercs",
        {
          label: "Cercs",
          rssFeed: "https://www.cercs.cat/rss/12",
          postalCode: "08698",
          coords: { lat: 42.1460611216552, lng: 1.86198010224165 },
          ...sharedData,
        },
      ],
      [
        "montclar",
        {
          label: "Montclar",
          rssFeed: "https://www.montclar.cat/rss/12",
          postalCode: "08619",
          coords: { lat: 42.0201761589551, lng: 1.76506382462485 },
          ...sharedData,
        },
      ],
      [
        "olvan",
        {
          label: "Olvan",
          rssFeed: "https://www.olvan.cat/rss/12",
          postalCode: "08611",
          coords: { lat: 42.056870146156, lng: 1.90698457841012 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default bergueda;
