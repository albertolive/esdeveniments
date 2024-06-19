const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const moianes = [
  "moianes",
  {
    label: "Moianès",
    province: "barcelona",
    towns: new Map([
      [
        "collsuspina",
        {
          label: "Collsuspina",
          rssFeed: "https://www.collsuspina.cat/rss/12",
          postalCode: "08178",
          coords: { lat: 41.8255470470624, lng: 2.17517697485499 },
          ...sharedData,
        },
      ],
      [
        "ccmoianes",
        {
          label: "Moià",
          rssFeed: "https://www.ccmoianes.cat/rss/12",
          postalCode: "08180",
          coords: { lat: 41.8129142, lng: 2.0971132 },
          ...sharedData,
        },
      ],
      [
        "monistroldecalders",
        {
          label: "Monistrol de Calders",
          rssFeed: "https://www.monistroldecalders.cat/rss/12",
          postalCode: "08275",
          coords: { lat: 41.7606040452777, lng: 2.01389293556143 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default moianes;
