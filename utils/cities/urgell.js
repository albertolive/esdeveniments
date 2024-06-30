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
    ]),
  },
];
export default urgell;
