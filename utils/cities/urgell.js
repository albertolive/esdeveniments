const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const urgell = [
  "urgell",
  {
    label: "Pla d'Urgell",
    province: "lleida",
    towns: new Map([
      [
        "horta",
        {
          label: "El Palau d'Anglesola",
          rssFeed: "https://www.ajhortons.cat/rss/12",
          postalCode: "25243",
          coords: { lat: 41.6516, lng: 0.8808 },
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
export default urgell;
